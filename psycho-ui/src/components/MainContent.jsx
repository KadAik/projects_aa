import {
    useCurrentPage,
    useCurrentPageSetter,
} from "./contexts/currentPageContext.js";
import Home from "../pages/Home.jsx";
import RegistrationForm from "./ApplicationForm.jsx";

export default function MainContent() {
    const currentPage = useCurrentPage();
    const setCurrentPage = useCurrentPageSetter;

    const pages = {
        home: <Home />,
        registration: <RegistrationForm />,
    };
    return <main>{pages[currentPage]}</main>;
}
