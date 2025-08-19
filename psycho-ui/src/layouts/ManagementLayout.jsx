import { createTheme } from "@mui/material";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Outlet } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import ContactPageIcon from "@mui/icons-material/ContactPage";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#dc004e",
        },
    },
    colorSchemes: { light: true, dark: false },
});

const NAVIGATION = [
    { kind: "header", title: "Principal" },
    {
        segment: "manage/dashboard",
        title: "Dashboard",
        icon: <DashboardIcon />,
    },
    { kind: "divider" },

    { kind: "header", title: "Gestion" },
    {
        segment: "manage/applications",
        title: "Candidatures",
        icon: <FolderIcon />,
    },
    {
        segment: "manage/applicants",
        title: "Candidats",
        icon: <ContactPageIcon />,
    },
];

const branding = {
    logo: <img src="/assets/logo2.png" alt="Armée de l'air" />,
    title: "S'élever pour faire face !",
};

export default function ManagementLayout() {
    return (
        <ReactRouterAppProvider
            theme={theme}
            navigation={NAVIGATION}
            branding={branding}
        >
            <DashboardLayout
                slots={
                    {
                        // sidebarFooter:,
                    }
                }
            >
                <PageContainer title={false}> {<Outlet />}</PageContainer>
            </DashboardLayout>
        </ReactRouterAppProvider>
    );
}
