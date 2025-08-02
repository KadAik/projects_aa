import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const DefaultLayout = () => {
    return (
        <>
            <header>
                <NavBar />
            </header>

            <main>
                <Outlet />
            </main>

            <Footer />
        </>
    );
};

export default DefaultLayout;
