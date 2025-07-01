import React, { useEffect, useState } from "react";
import axios from "axios";
import Apis from "../Apis";
import useAuth from "../../utils/Auth";
import { toast } from "react-toastify";
import "./Notification.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUnreadCount } from "../../react-redux/notificationSlice";

function Notifications() {
  const { token, user } = useAuth();
  const [allNotifications, setAllNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("request");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [projectId, setProjectId] = useState();
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(Apis.Get_Notifications, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notifications = res.data.data || [];
      setAllNotifications(notifications);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(
        Apis.MarkAllRead,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(setUnreadCount(0)); // Clear UI badge
    } catch (err) {
      console.log("Error marking as read", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    markAllAsRead();
  }, []);

  const updateNotificationStatus = (requestId, status) => {
    setAllNotifications((prev) =>
      prev.map((note) =>
        note.request_id === requestId
          ? {
            ...note,
            request: { ...note.request, status },
          }
          : note
      )
    );
  };

  const handleAccept = async (requestId, status) => {
    try {
      const res = await axios.put(
        `${Apis.Accept_Collab_Req}${requestId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjectId(res.data.request.project_id);
      toast.success(res.data.message || "Request accepted");
      updateNotificationStatus(requestId, "accepted");
    } catch (err) {
      toast.error("Error accepting request");
    }
  };

  const handleReject = async (requestId, status) => {
    try {
      const res = await axios.put(
        `${Apis.Accept_Collab_Req}${requestId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.info(res.data.message || "Request rejected");
      updateNotificationStatus(requestId, "rejected");
    } catch (err) {
      toast.error("Error rejecting request");
    }
  };

  const filtered = allNotifications.filter((n) => n.type === activeTab);
  console.log(filtered)
  return (
    <div className="notifications-container">
      <h2>Notifications</h2>

      <div className="tabs">
        {["request", "message", "info"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading">Loading notifications...</p>
      ) : filtered.length === 0 ? (
        <p className="empty">No {activeTab} notifications.</p>
      ) : (
        <div className="notification-list">
          {filtered.map((note) => {
            const request = note.request || note.request_id; // compatible with both
            const status = (request?.status || "").toLowerCase(); // normalize status

            const sender = note.sender || note.sender_id;
            const senderId = sender?.id || sender?.id; // SQL or Mongo
            const senderPhoto = sender?.profile_photo;
            const photoUrl = senderPhoto ? `https://buildbridge-bakend.onrender.com${senderPhoto}`
                : `https://ui-avatars.com/api/?name=${user?.name}&background=random`
            ;
              
            const requestId =
              typeof request === "object"
                ? request?.id
                : request

            // normalize status
            return (
              <div key={note.id} className="notification-item">
                {(note.type === "request" || note.type === "message") && (
                  <div className="notification-header">
                    <img
                      src={photoUrl}
                      alt="Sender"
                      className="profile-pic"
                      onClick={() =>
                        navigate(`/home/view-profile/${senderId}`)
                      }
                      title="View Profile"
                    />

                    {note.type === "request" && status === "pending" && (
                      <div className="icon-actions">
                        <img
                          src="/icons/right.png"
                          alt="Accept"
                          className="icon-btn"
                          title="Accept"
                          onClick={() =>
                            handleAccept(requestId, "accepted")
                          }
                        />
                        <img
                          src="/icons/image.png"
                          alt="Reject"
                          className="icon-btn"
                          title="Reject"
                          onClick={() =>
                            handleReject(note.request_id, "rejected")
                          }
                        />
                      </div>
                    )}
                  </div>
                )}

                <p className="notification-text">{note.content}</p>

                {note.type === "request" &&
                  status !== "pending" &&
                  status && (
                    <p className={`status-tag ${status}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </p>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notifications;
