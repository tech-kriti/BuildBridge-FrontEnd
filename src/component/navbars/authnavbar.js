import React, { useEffect, useState, useCallback } from "react";
import { Navbar, Container, Nav, Form, FormControl } from "react-bootstrap";
import { FaBell, FaPlus, FaUserCircle } from "react-icons/fa";
import DropDown from "./dropdown";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import useAuth from "../../utils/Auth";

// your client-side socket setup
import { toast } from "react-toastify";

// 🔁 Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../react-redux/notificationSlice";
import socket from "../../utils/Socket.js";
const DashboardNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

useEffect(() => {
  if (showDropdown && results.length === 0 && searchTerm.trim() !== "") {
    const timer = setTimeout(() => {
      setShowDropdown(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // cleanup
  }
}, [showDropdown, results, searchTerm]);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Debounced API call for search
  const fetchProjects = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        const res = await axios.get(`https://buildbridge-frontend.onrender.com/user/search?skillName=${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResults(res.data.projects || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 500),
    []
  );

 const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);

  if (value.trim() === "") {
    setResults([]);
    setShowDropdown(false); // 🛑 Hide dropdown if field is cleared
    return;
  }

  fetchProjects(value); // Only call when not empty
};

  const handleProjectClick = (projectId) => {
    setShowDropdown(false);
    setSearchTerm("");
    navigate(`/home/project/${projectId}`);
  };



  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar position-relative">
      <Container fluid>
        <div className="d-flex align-items-center">
          <FaUserCircle className="avatar-icon" onClick={toggleDropdown} />
          <Navbar.Brand className="ms-2" onClick={() => { navigate(-1) }} style={{ cursor: "pointer" }}>ProjectCollab</Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto w-100 justify-content-center position-relative">
            <Form className="d-flex ms-3" autoComplete="off">
              <FormControl
                type="search"
                placeholder="Search by skill..."
                className="search-bar"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Form>
            {showDropdown && (
              <div
                className="search-dropdown"
                style={{
                  position: "absolute",
                  top: "40px",
                  left: "25%",
                  right: "25%",
                  zIndex: 1050,
                  background: "#fff",
                  border: "1px solid #dee2e6",
                  borderRadius: "6px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {results.length > 0 ? (
                  results.map((project) => (
                    <div
                      key={project.project_id||project.id}
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                        cursor: "pointer",
                      }}
                      onClick={() => handleProjectClick(project.project_id||project.id)}
                    >
                      <strong>{project.title}</strong>
                      <p style={{ fontSize: "13px", margin: 0 }}>
                        Stack: {project.technical_stack}
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "12px", textAlign: "center", color: "#888" }}>
                    No results found
                  </div>
                )}
              </div>
            )}

          </Nav>

          <Nav className="ms-auto align-items-center">
            <FaPlus className="icon" title="Add Project" onClick={() => navigate('/home/add-project')} />
            <div className="position-relative">
              <FaBell
                className="icon"
                title="Notifications"
                onClick={() => navigate('/home/notifications')}
              />
              {unreadCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "10px", minWidth: "18px", textAlign: "center" }}
                >
                  {unreadCount}
                </span>
              )}

            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {dropdownOpen && (
        <div className="dropdown-container">
          <DropDown />
        </div>
      )}
    </Navbar>
  );
};

export default DashboardNavbar;
