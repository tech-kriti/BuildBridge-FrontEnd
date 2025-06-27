import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Apis from '../Apis';
import useAuth from '../../utils/Auth';
import './UpdateProject.css'; // style as needed

function EditProject() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${Apis.Get_projectByID}${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProject(res.data.project);
      } catch (err) {
        console.log("Error fetching project:", err);
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${Apis.Update_Project}${id}`, project, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Project updated successfully");
      setTimeout(() => navigate(`/home/project/${id}`), 1000);
    } catch (err) {
      setError("Update failed");
    }
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="edit-project-container">
      <h2>Edit Project</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" value={project.title} onChange={handleChange} placeholder="Title" />
        <textarea name="description" value={project.description} onChange={handleChange} placeholder="Description" />
        <input name="technical_stack" value={project.technical_stack} onChange={handleChange} placeholder="Tech Stack" />
        <input type="date" name="deadline" value={project.deadline?.slice(0, 10)} onChange={handleChange} />
        <input type="number" name="members_needed" value={project.members_needed} onChange={handleChange} placeholder="Members Needed" />
        <button type="submit">Update Project</button>
      </form>
    </div>
  );
}

export default EditProject;
