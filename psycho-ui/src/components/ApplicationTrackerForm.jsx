import { useState } from "react";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useApplications } from "../assets/PsychoAPI/requests";
import ApplicationStatus from "../pages/ApplicationStatus";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import { useSearchParams } from "react-router-dom";

const ApplicationTrackerForm = () => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        getValues,
        formState: { errors },
    } = useForm({ defaultValues: { tracking_id: "" } });

    const { data, refetch, isError, isPending, isFetching } = useApplications(
        { tracking_id: getValues("tracking_id") },
        { enabled: false, retry: false }
    );

    const onSubmit = async ({ tracking_id }) => {
        console.log("Tracking number is : ", tracking_id);
        // Update the url (add the query params)
        setSearchParams({ tracking_id });
        const result = await refetch();
        if (result.data) {
            setDialogOpen(true);
        }
        console.log(result.data);
    };

    const onError = (e) => {
        console.log(e);
    };

    const onDialogClose = () => {
        reset({ tracking_id: "" });
        setDialogOpen(false);
        setSearchParams({});
    };

    return (
        <Paper
            elevation={2}
            sx={{
                maxWidth: 400,
                mx: "auto",
                p: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h6" gutterBottom textAlign="center">
                Vérifier le statut de votre candidature
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit, onError)}>
                <Stack spacing={2}>
                    <TextField
                        label="Numéro de dossier *"
                        {...register("tracking_id", {
                            required: "Entrez votre numéro de dossier",
                        })}
                        helperText={errors.tracking_id?.message}
                        error={!!errors.tracking_id}
                        variant="outlined"
                        size="small"
                        value={watch("tracking_id")}
                        fullWidth
                    />

                    <Button type="submit" variant="contained" fullWidth>
                        {isFetching ? "Vérification..." : "Vérifier"}
                    </Button>
                </Stack>
            </Box>
            {data && (
                <Dialog open={dialogOpen} onClose={onDialogClose} maxWidth="md">
                    <DialogTitle display>
                        Candidature &nbsp;
                        <span style={{ color: "blue" }}>
                            {data.tracking_id}
                        </span>
                    </DialogTitle>
                    <DialogContent>
                        <ApplicationStatus
                            tracking_id={data.tracking_id}
                            isPending={isPending}
                            data={data}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onDialogClose}>Ok</Button>
                    </DialogActions>
                </Dialog>
            )}
            {isError && (
                <Dialog open={isError} onClose={onDialogClose}>
                    <DialogTitle
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        <ErrorOutlinedIcon color="error" />
                        <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                            Candidature non trouvée
                        </span>
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText
                            sx={{
                                fontSize: "0.95rem",
                                color: "text.secondary",
                            }}
                        >
                            Le numéro de dossier entré n’est pas valide.
                            Veuillez vérifier et réessayer.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions sx={{ justifyContent: "flex-end", p: 2 }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={onDialogClose}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                textTransform: "none",
                            }}
                        >
                            Fermer
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Paper>
    );
};

export default ApplicationTrackerForm;
