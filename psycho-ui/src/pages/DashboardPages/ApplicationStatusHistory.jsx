import { useState } from "react";
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    Menu,
    IconButton,
    MenuItem,
    Tooltip,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { formatDate } from "../../utils/utils";
import { grey } from "@mui/material/colors";

const statusHistorySample = [
    {
        id: 1,
        old_status: "Pending",
        new_status: "Accepted",
        date_changed: "2025-09-09T17:32:37.587247Z",
        note: "Demonstration d'acceptation",
        application: "2ae9597e-8d78-476c-b9a2-8cc8dd181596",
        changed_by: "Rodolpho",
    },
    {
        id: 2,
        old_status: "Accepted",
        new_status: "Rejected",
        date_changed: "2025-10-09T17:32:37.587247Z",
        note: "Demonstration de rejet",
        application: "2ae9597e-8d78-476c-b9a2-8cc8dd181596",
        changed_by: "Admin",
    },
];

export default function ApplicationStatusHistory({
    statusHistory = statusHistorySample,
    statusLabels,
    statusColors,
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <Paper elevation={0}>
            {statusHistory.length > 0 ?
                <>
                    <Tooltip title="Voir l'historique des statuts">
                        <IconButton
                            size="small"
                            onClick={handleOpen}
                            aria-controls={
                                open ? "status-history-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                        >
                            <HistoryIcon fontSize="small" color="primary" />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        id="status-history-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            paper: {
                                sx: {
                                    maxHeight: 400,
                                    overflow: "auto",
                                },
                            },
                        }}
                    >
                        {statusHistory.map((change) => (
                            <MenuItem
                                key={change.id}
                                onClick={handleClose}
                                divider
                            >
                                <ListItemText
                                    primary={
                                        <Chip
                                            size="small"
                                            label={
                                                statusLabels[
                                                    change.new_status
                                                ] || change.new_status
                                            }
                                            color={
                                                statusColors[
                                                    change.new_status
                                                ] || "default"
                                            }
                                            sx={{ mr: 1 }}
                                        />
                                    }
                                    secondary={
                                        <>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {formatDate(
                                                    change.date_changed
                                                )}{" "}
                                                — par {change.changed_by}
                                            </Typography>
                                            {change.note && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    display="block"
                                                    sx={{ fontStyle: "italic" }}
                                                >
                                                    {change.note}
                                                </Typography>
                                            )}
                                        </>
                                    }
                                />
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            :   <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    Aucun historique disponible
                </Typography>
            }
        </Paper>
    );
}
