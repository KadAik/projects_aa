import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import React from "react";
import CollapsibleMenu from "./NavBarAssets/CollapsibleMenu";
import NavTabs from "./NavBarAssets/NavTabs";

import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
    const navigate = useNavigate();
    return (
        <Box component="nav">
            <AppBar position="static" sx={{ backgroundColor: "#f0f0f0" }}>
                <Toolbar>
                    <IconButton
                        size="medium"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => navigate("/")}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                width: "100px",
                                height: "auto",
                                objectFit: "contain",
                            }}
                        />
                    </IconButton>
                    <Box
                        sx={{
                            display: { xs: "none", sm: "flex" },
                        }}
                    >
                        <NavTabs />
                    </Box>
                    <Box sx={{ marginTop: 0, marginLeft: "auto" }}>
                        <CollapsibleMenu />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navigation;
