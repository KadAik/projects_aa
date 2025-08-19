import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import Home from "./pages/Home";
import DefaultLayout from "./layouts/DefaultLayout";
import Applications from "./pages/Applications";
import ApplicationForm from "./components/ApplicationForm";
import ErrorNotFound from "./pages/ErrorNotFound";
import Navigation from "./components/Navigation";
import ApplicationStatus from "./pages/ApplicationStatus";
import ManagementLayout from "./layouts/ManagementLayout";
import Dashboard from "./pages/DashboardPages/Dashboard";
import ApplicationsManager from "./pages/DashboardPages/ApplicationsManager";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Anonymous user */}
            <Route path="/" element={<DefaultLayout />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="applications" element={<Applications />}>
                    <Route path="apply" element={<ApplicationForm />} />
                    <Route path="track" element={<ApplicationStatus />} />
                </Route>
                <Route path="test" element={<Navigation />} />
                <Route path="*" element={<ErrorNotFound />} />
            </Route>

            {/* Manager UI */}
            <Route path="/manage" element={<ManagementLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="applications" element={<ApplicationsManager />} />
            </Route>
        </>
    )
);

export default router;
