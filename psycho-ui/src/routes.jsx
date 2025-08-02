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

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="applications" element={<Applications />}>
                <Route path="create" element={<ApplicationForm />} />
            </Route>
            <Route path="*" element={<ErrorNotFound />} />
        </Route>
    )
);

export default router;
