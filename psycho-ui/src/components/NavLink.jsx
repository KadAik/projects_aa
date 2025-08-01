export default function NavLink({page_name, path, isCurrent, children}){
    return(
        <li className={`nav-item ${isCurrent ? "current-page" : ""}`.trim()}>
            <a href={path}>{children ? children : page_name}</a>
        </li>
    );
}