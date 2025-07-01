import { useEffect, useState } from "react";
import Apis from "../Apis";
import axios from "axios";
import useAuth, { getToken } from "../../utils/Auth";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewProject.css"
import { FaCogs, FaComment, FaComments, FaEdit, FaSignOutAlt, FaTrash, FaUserPlus } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function ViewDetails() {
  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState({});
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [showManageModal, setShowManageModal] = useState(false);
  const [acceptedMembers, setAcceptedMembers] = useState([]);

  useEffect(() => {
    loaddata();
    fetchMembers();
  }, [id]);
  let loaddata = async () => {

    try {

      console.log(token);
      console.log(user);
      const res = await axios.get(`${Apis.Get_projectByID}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjectDetail(res.data.project);

    } catch (error) {
      console.error('Error fetching projects:', error);
    }


  }
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${Apis.GetAcceptedMembers}${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data);
      setAcceptedMembers(res.data.members);
    } catch (err) {
      console.log("Error fetching members", err);
    }
  };
  console.log(user.id)
  const creatorId =
  typeof projectDetail.created_by === "object"
    ? projectDetail.created_by?.id 
    : projectDetail.created_by;

const currentUserId = user.userId || user.id;

const isCreator = creatorId === currentUserId;

 
  console.log(acceptedMembers)
  const isMember = acceptedMembers.some(m => m.user.userId === user.userId);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this education?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${Apis.Delete_project}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      loaddata(); // Refresh list
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `${Apis.UpdateMemberRole}${id}/update-role/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMembers(); // refresh
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  const removeMember = async (userId) => {
    try {
      await axios.delete(`${Apis.RemoveMEmber}${id}/remove/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMembers(); // refresh
    } catch (err) {
      console.error("Failed to remove member", err);
    }
  };
  const sendJoinRequest = async (project_id, receiver_id) => {
    console.log("Sending join request for project:", project_id, "to receiver:", receiver_id);
    try {
      const res = await axios.post(`${Apis.Send_Collab_Req}`, {
        project_id,
        receiver_id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success(res.data.message || "Join request sent!");
    } catch (err) {
      console.log(err);
      const msg = err.response?.data?.message || "Failed to send request";
      toast.error(msg);
    }
  };

  const handleLeaveProject = async (projectId) => {
    const confirmLeave = window.confirm("Are you sure you want to leave this project?");
    if (!confirmLeave) return;

    try {
      const res = await axios.delete(`${Apis.LeaveProject}${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(res.data.message || "Left the project successfully!");

      // ✅ Optional: redirect to joined project page
      navigate("/home/my-project"); // change as per your route

    } catch (err) {
      console.error("Leave error:", err);
      toast.error(err.response?.data?.message || "Failed to leave project.");
    }
  };
console.log(projectDetail)
  return <>

    <div className="project-details-container">
      <div className="project-card-details">
        <h2 className="project-title">{projectDetail.title}</h2>
        <p className="project-description">{projectDetail.description}</p>

        <div className="project-infoo">
          <div className="info-row">
            <strong>Created By:</strong>
            <span>
              {projectDetail.created_by?.name || projectDetail.user?.name}
              (<span className="email" style={{cursor:"pointer"}} onClick={() => navigate(`/home/view-profile/${projectDetail.user?.userId||projectDetail.created_by?.id}`)}>{projectDetail.created_by?.email || projectDetail.user?.email}</span>)
            </span>
            
          </div>
          <div className="info-row">
            <strong>Deadline:</strong>
            <span>
              {new Date(projectDetail.deadline).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </span>
          </div>
          <div className="info-row">
            <strong>Members Needed:</strong>
            <span>{projectDetail.members_needed}</span>
          </div>
          <div className="info-row">
            <strong>Tech-Stack:</strong>
            <span>
              {projectDetail.technical_stack}
              
            </span>
            </div>
          <div className="info-row">
            <strong>Technologies:</strong>
           
           
              {projectDetail?.technologies?.map((tech, idx) => (
               
              <span key={idx} className="stack-badge">{tech.name}</span>
              ))}
           
          </div>
        </div>

        <div className="action-buttons">
          {isCreator ? (
            <>
              <button className="icon-btnn manage" onClick={() => setShowManageModal(true)}><FaCogs /> Manage</button>
              <button className="icon-btnn edit" onClick={() => navigate(`/home/edit-project/${id}`)}><FaEdit /> Edit</button>
              <button className="icon-btnn delete" onClick={() => handleDelete(id)}><FaTrash /> Delete</button>
              <button className="icon-btnn chat" onClick={() => navigate(`/home/chatroom/${id}`)}><FaComments /> Chat</button>
            </>
          ) : isMember ? (
            <>
              <button className="icon-btnn leave" onClick={() => handleLeaveProject(id)}><FaSignOutAlt /> Leave</button>
              <button className="icon-btnn chat" onClick={() => navigate(`/home/chatroom/${id}`)}><FaComments /> Chat</button>
            </>
          ) : (
            <button className="icon-btnn request" onClick={() => sendJoinRequest(id, projectDetail.created_by?.id || projectDetail.created_by)} ><FaUserPlus /> Request to Join</button>
          )}
        </div>
      </div>
    </div>

    {showManageModal && (
      <div className="inline-manage-box">
        <button className="close-manage-btn" onClick={() => setShowManageModal(false)}>
          Close
        </button>
        <h3>Manage Members</h3>
        

        {acceptedMembers.length === 0 ? (
          <p>No accepted members.</p>
        ) : (
          acceptedMembers.map((member) => (
            <div className="member-row" key={member.user.userId}>
              <span className="member-name">{member.user.name}</span>

              <div className="member-controls">
                <select
                  value={member.role}
                  onChange={(e) =>
                    handleRoleChange(member.user.userId||member.user.id, e.target.value)
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>

                <button
                  className="remove-btn"
                  onClick={() => removeMember(member.user.userId || member.user.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    )}

  </>
}

export default ViewDetails;