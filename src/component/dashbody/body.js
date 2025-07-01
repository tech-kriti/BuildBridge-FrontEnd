import React, { useEffect, useState } from "react";
import "./body.css";
import axios from "axios";
import Apis from "../Apis";
import useAuth, { getToken } from "../../utils/Auth.js";
import { useNavigate } from "react-router-dom";

const dummyProjects = [
  {
    title: "AI Chatbot",
    description: "Building an AI chatbot for customer support.",
    stack: ["React", "Node.js", "Python"],
    membersNeeded: 2,
    deadline: "2025-06-10"
  },
  {
    title: "E-commerce Website",
    description: "Developing a scalable e-commerce platform.",
    stack: ["Angular", "Spring Boot"],
    membersNeeded: 3,
    deadline: "2025-07-01"
  },
  {
    title: "Portfolio Website",
    description: "Creating personal portfolio website for designers.",
    stack: ["HTML", "CSS", "JavaScript"],
    membersNeeded: 1,
    deadline: "2025-05-30"
  },
  {
    title: "Portfolio Website",
    description: "Creating personal portfolio website for designers.",
    stack: ["HTML", "CSS", "JavaScript"],
    membersNeeded: 1,
    deadline: "2025-05-30"
  },
  {
    title: "Portfolio Website",
    description: "Creating personal portfolio website for designers.",
    stack: ["HTML", "CSS", "JavaScript"],
    membersNeeded: 1,
    deadline: "2025-05-30"
  }
];

function Feed() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    try {

      let response = await axios.get(Apis.Get_All_Projects, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.projects);
      setProjects(response.data.projects);
    }
    catch (err) {
      console.log(err);

    }
  }
  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  return <>
    <h1 className="section-heading">Recommended Projects</h1>
    <div className="feed-container">

      {projects.map((project, index) => (
        <div key={index} className="project-card">
          <h3>{project.title}</h3>
          <p className="discription">{truncateText(project.description, 150)}</p>
          <div className="stack">
            {project.technologies?.slice(0, 3).map((tech, idx) => (
              <span className="stack-badge" key={idx}>{tech.name}</span>
            ))}
            {project.technologies?.length > 3 && <span className="stack-badge">+{project.technologies.length - 3}</span>}
          </div>
          <div className="project-info">
            <span className="card-badge">👥 Members Needed: {project.members_needed}</span>
            <span className="card-badge deadline">🗓️ Deadline:{new Date(project.deadline).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </div>
          <div className="btn">
            <button className="join-btn " onClick={() => navigate(`/home/project/${project.project_id || project.id}`)}>View Project</button>
          </div>
        </div>
      ))}
    </div>
  </>
};

export default Feed;
