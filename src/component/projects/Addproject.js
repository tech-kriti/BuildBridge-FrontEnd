import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Apis from '../Apis';
import useAuth from '../../utils/Auth';
import styles from './AddProject.module.css';
import Select from 'react-select';

const AddProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technical_stack: '',
    deadline: '',
    members_needed: 1,
  });

  const [technologyOptions, setTechnologyOptions] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { token } = useAuth();

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const res = await axios.get(Apis.Get_Tech);
        const options = res.data.technologies.map((tech) => ({
          value: tech.technology_id,
          label: tech.name,
        }));
        setTechnologyOptions(options);
      } catch (err) {
        console.error('Error fetching technologies', err);
      }
    };
    fetchTechnologies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechChange = (selectedOptions) => {
    setSelectedTechnologies(selectedOptions || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const technologyIds = selectedTechnologies.map((tech) => tech.value);
    console.log("Selected techs:", selectedTechnologies);
console.log("Mapped technology IDs:", technologyIds);

    try {
      const res = await axios.post(
        Apis.Add_project,
        { ...formData, technologyIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.project) {
        setMessage('Project created successfully!');
        setFormData({
          title: '',
          description: '',
          technical_stack: '',
          deadline: '',
          members_needed: 1,
        });
        setSelectedTechnologies([]);
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Add New Project</h2>
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          required
          className={styles.textarea}
        />
        <input
          type="text"
          name="technical_stack"
          placeholder="Technical Stack"
          value={formData.technical_stack}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="number"
          name="members_needed"
          min="1"
          value={formData.members_needed}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <div className={styles.selectWrapper}>
          <label className={styles.label}>Select Technologies:</label>
          <Select
            isMulti
            name="technologies"
            options={technologyOptions}
            value={selectedTechnologies}
            onChange={handleTechChange}
            className={styles.reactSelect}
            classNamePrefix="select"
            placeholder="Search & select technologies"
          />
        </div>

        <button type="submit" className={styles.submitBtn}>Add Project</button>
      </form>
    </div>
  );
};

export default AddProject;
