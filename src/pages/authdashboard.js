import Feed from "../component/dashbody/body";
import Footer from "../component/Footer";
import Navbar from "../component/navbars/authnavbar";
import DropDown from "../component/navbars/dropdown";
import "../component/dashbody/body.css"
import { Outlet, Route, Routes } from "react-router-dom";
import MyProjects from "../component/projects/Myproject";

function AuthDashboard() {
    return <>
        <Navbar />
        <div className="dashboard-layout">
            <div className="scrollable-feed">
                <div className="feed-section">
                    <Outlet />
                </div>
            </div>
        </div>
        <Footer />
    </>
}
export default AuthDashboard;