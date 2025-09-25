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
import ManagementLayout from "./layouts/ManagementLayout";
import Dashboard from "./pages/DashboardPages/Dashboard";
import ApplicationsManager from "./pages/DashboardPages/ApplicationsManager";
import ApplicationTrackerForm from "./components/ApplicationTrackerForm";
import ApplicantProfileEditForm from "./pages/DashboardPages/ApplicantProfileEditForm";
import ApplicationsList from "./pages/DashboardPages/ApplicationsList";
import ApplicantsManager from "./pages/DashboardPages/ApplicantsManager";
import ApplicationDetails from "./pages/DashboardPages/ApplicationDetails";
import ApplicationStatusHistoryMenu from "./pages/DashboardPages/ApplicationStatusHistoryMenu";
import ApplicationReview from "./pages/DashboardPages/Assets/ApplicationReview";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Anonymous user */}
            <Route path="/" element={<DefaultLayout />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="applications" element={<Applications />}>
                    <Route path="apply" element={<ApplicationForm />} />
                    <Route path="track" element={<ApplicationTrackerForm />} />
                </Route>
                <Route path="test" element={<Navigation />} />
                <Route path="*" element={<ErrorNotFound />} />
            </Route>

            {/* Manager UI */}
            <Route path="/manage" element={<ManagementLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="applicants" element={<ApplicantsManager />}>
                    {/* <Route index element={<ApplicantsList />} /> */}
                    <Route
                        path=":applicantId"
                        element={<ApplicantProfileEditForm />}
                    />
                </Route>
                <Route path="applications" element={<ApplicationsManager />}>
                    <Route index element={<ApplicationsList />} />
                    <Route
                        path=":applicationId"
                        element={<ApplicationDetails />}
                    />
                </Route>
                <Route path="edit" element={<ApplicationReview />} />
            </Route>
        </>
    )
);

export default router;
