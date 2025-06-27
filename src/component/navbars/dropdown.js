import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"
 import { FaBell, FaPlus, FaUserCircle, FaEdit } from "react-icons/fa";
import useAuth from "../../utils/Auth";
import { useDispatch } from "react-redux";
import { logout } from "../../react-redux/UserSlice";
import { NavLink } from 'react-router-dom';
import React from "react";

function DropDown(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const{user}= useAuth();
     const handleLogout = () => {
    dispatch(logout());           // Clear Redux store
    navigate("/login");           // Redirect to login page
  };
  
    return<>
       {/* <div className="avatar-dropdown">
                             <div className="profile-section">
                                 <div className="avatar-container">
                                     <img src={`http://localhost:3000${user.profile_photo}`}alt="Profile" className="avatar" />
                                     <FaEdit className="edit-icon" onClick={()=>navigate("/home/create-profile")} />
                                 </div>
                                 <div className="user-name">{user.name}</div>
                             </div>
                             <div className="dropdown-links">
                                  <Link to ="/home/profile/:id">View Profile</Link>
                                  <Link to ="/home/add-education">Add Education</Link>
                                  <Link to ="/home/add-skill">Add skills</Link>
                                 
                                 <Link to ="/home/my-projects">My Project</Link>
                                 
                                   <a onClick={handleLogout} className="logout-btn">Logout</a>
                                
                             </div>
                         </div> */}





   

    
        <div className="sidebar">
            <nav className="sidebar-nav">
                <div className="profile-left">
                    <img
                        src={`https://buildbridge-bakend.onrender.com${user.profile_photo}`}
                        alt="Profile"
                        className="profile-Image"
                    />
                     <FaEdit className="edit-icon" onClick={()=>navigate("/home/create-profile")} />
                </div>
                <div className="profile-right">
                    <h4>{user?.name || "User"}</h4>
                </div>
                
                <NavLink to="/home/profile" className="sidebar-link">
                    <i className="bi bi-person-circle me-2"></i> Profile
                </NavLink>
                <NavLink to="/home/add-education" className="sidebar-link">
                    <i className="bi bi-mortarboard"></i> Add Education
                </NavLink>

                  <NavLink to="/home/add-skill" className="sidebar-link">
                    <i className="bi bi-lightbulb me-2"></i> Add Skills
                </NavLink>
                
                <NavLink to="/home/my-projects" className="sidebar-link">
                    <i className="bi bi-rocket-takeoff me-2"></i> My Projects
                </NavLink>
                

                <button className="logout"onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout </button>
            </nav>
        </div>
   



    </>
}
export default DropDown;