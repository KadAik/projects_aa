import {
    Paper,
    Typography,
    Divider,
    Grid,
    Box,
    Tooltip,
    IconButton,
    Chip,
    Skeleton,
    useTheme,
} from "@mui/material";
import {
    Assignment,
    ContentCopy,
    CalendarToday,
    Update,
    Link as LinkIcon,
} from "@mui/icons-material";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { useState } from "react";
import { applicationStatus } from "../../shared/psychoApi/applicationConfig";
import { formatDate } from "../../utils/utils";
import ApplicationStatusHistoryMenu from "./ApplicationStatusHistoryMenu";

const ApplicationMetaData = ({ application, isLoading = false }) => {
    const theme = useTheme();
    const [copiedField, setCopiedField] = useState(null);

    const handleCopyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1500);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const statusHistoryMenuOpen = Boolean(anchorEl);

    const handleStatusMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleStatusMenuClose = () => setAnchorEl(null);

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }} component="section">
            <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
                <Assignment color="primary" />
                Métadonnées
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3} sx={{ width: "100%" }}>
                {/* Tracking ID */}
                <Grid>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                        }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            Numéro de suivi:
                        </Typography>
                        {!isLoading && (
                            <Tooltip
                                title={
                                    copiedField === "tracking" ? "Copié !" : (
                                        "Copier"
                                    )
                                }
                            >
                                <IconButton
                                    size="small"
                                    onClick={() =>
                                        handleCopyToClipboard(
                                            application.tracking_id,
                                            "tracking"
                                        )
                                    }
                                >
                                    <ContentCopy fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    {isLoading ?
                        <Skeleton variant="rounded" width="100%" height={28} />
                    :   <Typography
                            variant="body2"
                            sx={{
                                backgroundColor: theme.palette.grey[100],
                                p: 1,
                                borderRadius: 1,
                            }}
                        >
                            {application.tracking_id}
                        </Typography>
                    }
                </Grid>

                {/* Application ID */}
                <Grid>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                        }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            ID de la candidature:
                        </Typography>
                        {!isLoading && (
                            <Tooltip
                                title={
                                    copiedField === "application" ? "Copié !"
                                    :   "Copier"
                                }
                            >
                                <IconButton
                                    size="small"
                                    onClick={() =>
                                        handleCopyToClipboard(
                                            application.application_id,
                                            "application"
                                        )
                                    }
                                >
                                    <ContentCopy fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    {isLoading ?
                        <Skeleton variant="rounded" width="100%" height={28} />
                    :   <Typography
                            variant="body2"
                            sx={{
                                fontFamily: "monospace",
                                backgroundColor: theme.palette.grey[100],
                                p: 1,
                                borderRadius: 1,
                                wordBreak: "break-all",
                            }}
                        >
                            {application.application_id}
                        </Typography>
                    }
                </Grid>

                {/* Status */}
                <Grid>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                        }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            Statut:
                            <Tooltip title="Visualiser l'historique des statuts">
                                <IconButton
                                    size="small"
                                    onClick={handleStatusMenuOpen}
                                >
                                    <HistoryOutlinedIcon
                                        fontSize="small"
                                        color="primary"
                                    />
                                </IconButton>
                            </Tooltip>
                        </Typography>
                        <ApplicationStatusHistoryMenu
                            anchorEl={anchorEl}
                            handleClose={handleStatusMenuClose}
                            open={statusHistoryMenuOpen}
                        />
                    </Box>
                    {isLoading ?
                        <Skeleton variant="rounded" width={100} height={30} />
                    :   <Chip
                            label={
                                applicationStatus[application.status]?.label ||
                                "Inconnu"
                            }
                            color={
                                applicationStatus[application.status]?.color ||
                                "default"
                            }
                            variant="filled"
                            size="small"
                        />
                    }
                </Grid>

                {/* Date Submitted */}
                <Grid>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                        <CalendarToday fontSize="small" />
                        Date de soumission:
                    </Typography>
                    {isLoading ?
                        <Skeleton width="100%" height={28} />
                    :   <Typography variant="body2">
                            {formatDate(application.date_submitted)}
                        </Typography>
                    }
                </Grid>

                {/* Date Updated */}
                <Grid>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                        <Update fontSize="small" />
                        Dernière modification:
                    </Typography>
                    {isLoading ?
                        <Skeleton width="100%" height={28} />
                    :   <Typography variant="body2">
                            {formatDate(application.date_updated)}
                        </Typography>
                    }
                </Grid>

                {/* API URL */}
                <Grid>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                        <LinkIcon fontSize="small" />
                        URL de l'API:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {isLoading ?
                            <Skeleton
                                variant="rounded"
                                width="100%"
                                height={28}
                            />
                        :   <>
                                <Typography
                                    variant="body2"
                                    fontFamily="monospace"
                                    sx={{
                                        backgroundColor:
                                            theme.palette.grey[100],
                                        p: 1,
                                        borderRadius: 1,
                                        flex: 1,
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {application.url}
                                </Typography>
                                <Tooltip
                                    title={
                                        copiedField === "url" ? "Copié !" : (
                                            "Copier"
                                        )
                                    }
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            handleCopyToClipboard(
                                                application.url,
                                                "url"
                                            )
                                        }
                                    >
                                        <ContentCopy fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </>
                        }
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ApplicationMetaData;
