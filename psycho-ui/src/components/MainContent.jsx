import { useCurrentPage, useCurrentPageSetter } from "./Contexts/currentPageContext.js";
import Home from "./Home.jsx";
import RegistrationForm from "./RegistrationForm.jsx";


export default function MainContent(){

    const currentPage = useCurrentPage();
    const setCurrentPage = useCurrentPageSetter;

    const pages = {
        "home": <Home />,
        "registration": <RegistrationForm />,
    }
    return(
        <main>
            {pages[currentPage]}
        </main>
        
    );
}