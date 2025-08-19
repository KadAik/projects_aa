import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import Navigation from "../components/Navigation";
import { Box } from "@mui/material";

const DefaultLayout = () => {
    return (
        <>
            <Box component="header">
                <Navigation />
            </Box>

            <Box
                component="main"
                sx={{
                    flex: 1,
                    flexDirection: "column",
                    p: 2,
                }}
            >
                <Outlet />
            </Box>

            <Footer />
        </>
    );
};

export default DefaultLayout;
