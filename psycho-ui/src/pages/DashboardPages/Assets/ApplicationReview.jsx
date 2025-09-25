import React, { useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Stack,
    Avatar,
    TextField,
    Button,
    IconButton,
    Divider,
    useTheme,
    alpha,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Mock data structure for reviews
const mockReviews = [
    {
        id: 1,
        text: "Le dossier est complet et répond aux critères d'admission. Recommande l'acceptation.",
        author: "Jean Dupont",
        role: "Responsable admissions",
        timestamp: "2024-01-15T14:30:00Z",
        avatar: "JD",
    },
    {
        id: 2,
        text: "Vérification des pièces justificatives nécessaire. Certains documents semblent manquants.",
        author: "Marie Martin",
        role: "Secrétaire pédagogique",
        timestamp: "2024-01-14T10:15:00Z",
        avatar: "MM",
    },
];

const ApplicationReview = ({
    applicationId,
    reviews = mockReviews,
    onAddReview,
    onEditReview,
    onDeleteReview,
}) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    const [newReview, setNewReview] = useState("");
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editText, setEditText] = useState("");

    const handleAddReview = () => {
        if (newReview.trim()) {
            onAddReview?.({
                text: newReview.trim(),
                applicationId,
                timestamp: new Date().toISOString(),
            });
            setNewReview("");
        }
    };

    const handleStartEdit = (review) => {
        setEditingReviewId(review.id);
        setEditText(review.text);
    };

    const handleSaveEdit = () => {
        if (editText.trim()) {
            onEditReview?.(editingReviewId, editText.trim());
            setEditingReviewId(null);
            setEditText("");
        }
    };

    const handleCancelEdit = () => {
        setEditingReviewId(null);
        setEditText("");
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const reviewDate = new Date(timestamp);
        const diffInHours = Math.floor((now - reviewDate) / (1000 * 60 * 60));

        if (diffInHours < 1) return "À l'instant";
        if (diffInHours < 24) return `Il y a ${diffInHours} h`;
        if (diffInHours < 168)
            return `Il y a ${Math.floor(diffInHours / 24)} j`;
        return formatDate(timestamp);
    };

    return (
        <Accordion
            expanded={expanded}
            onChange={(event, isExpanded) => setExpanded(isExpanded)}
            sx={{
                mt: 2,
                borderRadius: 2,
                boxShadow: theme.shadows[1],
                "&:before": { display: "none" },
                "&.Mui-expanded": { marginTop: 2 },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    backgroundColor:
                        expanded ?
                            alpha(theme.palette.primary.main, 0.05)
                        :   "transparent",
                    borderBottom:
                        expanded ?
                            `1px solid ${theme.palette.divider}`
                        :   "none",
                    borderRadius: expanded ? "8px 8px 0 0" : "8px",
                    minHeight: 60,
                    "&.Mui-expanded": { minHeight: 60 },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Historique des revues
                    </Typography>
                    <Box
                        sx={{
                            px: 1.5,
                            py: 0.5,
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                            borderRadius: 12,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                        }}
                    >
                        {reviews.length}
                    </Box>
                </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
                {/* Add new review section */}
                <Box
                    sx={{
                        p: 3,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Ajouter une nouvelle revue..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddReview}
                            disabled={!newReview.trim()}
                        >
                            Ajouter une revue
                        </Button>
                    </Box>
                </Box>

                {/* Reviews list */}
                <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                    {reviews.length === 0 ?
                        <Box sx={{ p: 3, textAlign: "center" }}>
                            <Typography color="text.secondary">
                                Aucune revue pour le moment
                            </Typography>
                        </Box>
                    :   reviews.map((review, index) => (
                            <Box key={review.id}>
                                <Box sx={{ p: 3 }}>
                                    <Stack spacing={2}>
                                        {/* Review header */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.5,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        bgcolor:
                                                            theme.palette
                                                                .primary.main,
                                                        fontSize: "0.875rem",
                                                    }}
                                                >
                                                    {review.avatar}
                                                </Avatar>
                                                <Box>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{ fontWeight: 600 }}
                                                    >
                                                        {review.author}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {review.role}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {getTimeAgo(
                                                        review.timestamp
                                                    )}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleStartEdit(review)
                                                    }
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        onDeleteReview?.(
                                                            review.id
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        {/* Review content */}
                                        {editingReviewId === review.id ?
                                            <Box>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    value={editText}
                                                    onChange={(e) =>
                                                        setEditText(
                                                            e.target.value
                                                        )
                                                    }
                                                    sx={{ mb: 2 }}
                                                />
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        gap: 1,
                                                        justifyContent:
                                                            "flex-end",
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        onClick={
                                                            handleCancelEdit
                                                        }
                                                    >
                                                        Annuler
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={handleSaveEdit}
                                                    >
                                                        Sauvegarder
                                                    </Button>
                                                </Box>
                                            </Box>
                                        :   <Typography
                                                variant="body2"
                                                sx={{
                                                    lineHeight: 1.6,
                                                    whiteSpace: "pre-wrap",
                                                }}
                                            >
                                                {review.text}
                                            </Typography>
                                        }
                                    </Stack>
                                </Box>
                                {index < reviews.length - 1 && <Divider />}
                            </Box>
                        ))
                    }
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default ApplicationReview;
