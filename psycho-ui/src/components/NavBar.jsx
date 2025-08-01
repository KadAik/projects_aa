import NavLink from "./NavLink";

const leftMenuNavItems = [
    {page_name: "Accueil", path: "/home"},
    {page_name: "Suivre ma candidature", path: "/track-application"},
    {page_name: "Trouver mon centre", path: "/find-center"},
    {page_name: "Calendrier", path: "/calendar"}
];

export default function NavBar(){
    return(
        <nav id="top-navigation-bar">
                {/* Logo */}
                <div id="logo">
                    <img src="logo.png" alt="Logo" />
                </div>
            
                {/* Left menu */}
                <ul id="left-menu">
                    {leftMenuNavItems.map(item => (
                        <NavLink 
                            key={item.path}
                            page_name={item.page_name}
                            path={item.path}
                            isCurrent={false}
                        />
                    ))}
                </ul>
            
                {/* Right menu */}
                <ul id="right-menu">
                    <li className="nav-item"><input type="search" placeholder="Search..." /></li>
                    <li className="nav-item">Outils</li>
                    <li className="nav-item">Profile</li>
                </ul>
            </nav>
    );
}