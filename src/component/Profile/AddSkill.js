// src/components/AddSkill.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Apis from '../Apis';
import useAuth from '../../utils/Auth';
import './AddEducation.css';
import './Addskill.css'

function AddSkill() {
    const { token, user } = useAuth();
    const [education, setEducation] = useState({
        skillName: '',
        proficiencyLevel: '',
    });
    const [skillList, setSkilllist] = useState([]);
    useEffect(() => {
        if (skillList) {
            fetchSkill();
        }

    }, []);
    const [editingId, setEditingId] = useState(null);

    const fetchSkill = async () => {
        try {
            const res = await axios.get(`${Apis.Get_Skills}${user.userId||user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setSkilllist(res.data.skills);


        } catch (err) {
            console.log("fetching skill error", err);
        }
    }

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setEducation({ ...education, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { skillName, proficiencyLevel } = education;
        console.log(education)
        if (!skillName || !proficiencyLevel) {
            return setError('All fields are required');
        }

        try {
            if (editingId) {
                await axios.put(`${Apis.Update_Skill}${editingId}`, education, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessage('Skill updated successfully');
                setEditingId(null);

            } else {
                const res = await axios.post(Apis.Add_Skill, education, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                setMessage('Skill added successfully');
            }
            setError('');
            setEducation({ skillName: '', proficiencyLevel: '' });
            fetchSkill();
        } catch (err) {
            setMessage('');
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };
    const handleEdit = (skill) => {
        setEducation({
            skillName: skill.skillName,
            proficiencyLevel: skill.proficiencyLevel,
        });
        setEditingId(skill.skillId||skill.id);
        setMessage('');
        setError('');
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${Apis.Delete_Skill}${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchSkill(); // Refresh after delete
        } catch (err) {
            console.log("Delete error:", err);
        }
    };


    return <>
        <div className="skill-form-container">
            <h3 className="section-title">{editingId ? 'Edit Skill' : 'Add Skill'}</h3>

            {message && <p className="success">{message}</p>}
            {Array.isArray(error) ? (
                error.map((err, idx) => (
                    <p key={idx} className="error">{err.msg}</p>
                ))
            ) : (
                error && <p className="error">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="skill-form">
                <input
                    type="text"
                    name="skillName"
                    placeholder="Enter Skill Name"
                    value={education.skillName}
                    onChange={handleChange}
                />

                <select
                    name="proficiencyLevel"
                    value={education.proficiencyLevel}
                    onChange={handleChange}
                >
                    <option value="">Select Proficiency Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                </select>

                <button type="submit">
                    {editingId ? "Update Skill" : "Add Skill"}
                </button>
            </form>
        </div>
        <div className="skills-section">
            <h3>Your Skills</h3>
            <div className="skills-list">
                {skillList.map((skill) => (
                    <div className="skill-card" key={skill.skillId||skill.id}>
                        <h4>{skill.skillName}</h4>
                        <p data-level={skill.proficiencyLevel}>{skill.proficiencyLevel}</p>
                        <div className="actions">
                            <button onClick={() => handleEdit(skill)}>Edit</button>
                            <button style={{backgroundColor:"#dc3545"}} onClick={() => {
                                const confirmDelete = window.confirm("Are you sure you want to delete this skill?");
                                if (confirmDelete) handleDelete(skill.skillId||skill.id);
                            }} >Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
}

export default AddSkill;
