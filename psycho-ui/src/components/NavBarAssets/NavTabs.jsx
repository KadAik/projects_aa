import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function NavTabs() {
    const location = useLocation();

    return (
        <Box sx={{ width: "100%" }}>
            <Tabs
                value={location.pathname}
                aria-label="nav tabs"
                role="navigation"
            >
                <Tab label="Accueil" value="/" component={NavLink} to="/" />
                <Tab
                    label="Postuler"
                    value="/applications/apply"
                    component={NavLink}
                    to="/applications/apply"
                />
                <Tab
                    label="Suivre"
                    value="/applications/track"
                    component={NavLink}
                    to="/applications/track"
                />
            </Tabs>
        </Box>
    );
}
