import React, { useEffect, useState } from 'react';
import './myproject.css';
import { FaEdit, FaTrash, FaComments, FaEye, FaSignOutAlt } from 'react-icons/fa';
import Apis from '../Apis';
import useAuth, { getToken } from '../../utils/Auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const MyProjects = () => {
  const [activeTab, setActiveTab] = useState('created');
  const [createdProjects, setCreatedProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const { token } = useAuth();
  useEffect(() => {
    fetchMyProjects();
  }, []);
  const navigate = useNavigate();

  const fetchMyProjects = async () => {
    try {

      const res = await axios
        .get(Apis.Get_myProject, {
          headers: { Authorization: `Bearer ${token}` },
        });
      console.log(res.data);

      setCreatedProjects(res.data.createdProjects || []);
      setJoinedProjects(res.data.joinedProjects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };




  const displayedProjects = activeTab === 'created' ? createdProjects : joinedProjects;
    const truncateText = (text, maxLength) =>
  text?.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  return (
    <div className="my-projects-container">
      <div className="tabs">
        <button className={activeTab === 'created' ? 'active' : ''} onClick={() => setActiveTab('created')}>
          Created Projects
        </button>
        <button className={activeTab === 'joined' ? 'active' : ''} onClick={() => setActiveTab('joined')}>
          Joined Projects
        </button>
      </div>

      <div className="projects-grid">
        {displayedProjects.length > 0 ? (
          displayedProjects.map(project => (
            <div className="project-card" key={project.id}>
              <h3 className="project-title">{project.title}</h3>
              <p className='discription'>{truncateText(project.description, 150)}</p>
              <div className="stack">
                {project.technologies?.slice(0, 3).map((tech, idx) => (
                  <span className="stack-badge" key={idx}>{tech.name}</span>
                ))}
                {project.technologies?.length > 3 && <span className="stack-badge">+{project.technologies.length - 3}</span>}
              </div>
              <div className="project-info">
                <span>📅 Deadline: {new Date(project.deadline).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>

              {/* Conditionally render buttons */}

              <div className="btn">
                <button className="join-btn " onClick={() => navigate(`/home/project/${project.project_id || project.id}`)}>View Project</button>
              </div>

            </div>
          ))
        ) : (
          <div className="empty-state">
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Projects" />
            <p>No {activeTab === 'created' ? 'Created' : 'Joined'} Projects yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
