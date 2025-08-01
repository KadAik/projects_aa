import { useCurrentPageSetter } from "./Contexts/currentPageContext";

export default function ButtonLink({href, classList, children}){

    const setCurrentPage = useCurrentPageSetter();

    return(
        <a href={href} className={classList} onClick={() => setCurrentPage("registration")}>{children}</a>
    );
}