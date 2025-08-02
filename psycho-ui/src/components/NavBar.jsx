import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";
import "./styles/navBar.css";

const leftMenuNavItems = [
    { page_name: "Accueil", path: "/home" },
    { page_name: "Postuler", path: "/applications/create" },
    { page_name: "Suivi", path: "/track-application" },
    { page_name: "Calendrier", path: "/calendar" },
];

export default function NavBar() {
    return (
        <nav id="top-navigation-bar">
            {/* Logo */}
            <div id="logo">
                <img src={logo} alt="Logo" />
            </div>

            {/* Left menu */}
            <ul id="left-menu">
                {leftMenuNavItems.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            {item.page_name}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* Right menu */}
            <ul id="right-menu">
                <li className="nav-item">
                    <input type="search" placeholder="Search..." />
                </li>
                <li className="nav-item">Outils</li>
                <li className="nav-item">Profile</li>
            </ul>
        </nav>
    );
}
