import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Apis from "../Apis";
import useAuth from "../../utils/Auth";
import "./chatroom.css";
import { useParams } from "react-router-dom";
import socket from "../../utils/Socket.js";
const ChatRoom = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const { user ,token} = useAuth();
  
  const chatEndRef = useRef(null);
  const {id} = useParams();
    useEffect(() => {
    if (id) {
      socket.emit("joinRoom", id);
    }

    // 👂 Listen for new messages from socket
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("newMessage");
    };
  }, [id]);

  useEffect(() => {
    fetchMessages();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${Apis.GetMesaages}${id}}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.mesages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const handleSend = async () => {
    if (!content.trim()) return;
    try {
      const res = await axios.post(
        Apis.SendMessages,
        { content, project_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      
      socket.emit("sendMessage", res.data.data);
      setContent("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };
const groupMessagesByDate = (messages) => {
  return messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateLabel = (dateStr) => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (dateStr === today) return "TODAY";
  if (dateStr === yesterday) return "YESTERDAY";
  return new Date(dateStr).toLocaleDateString();
};
  return (
    <div className="chat-container">
      <div className="chat-header">Project Chat</div>
      <div className="chat-body">
        {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
           <div key={date}>
            <div className="chat-date-label">{formatDateLabel(date)}</div>
        {msgs.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender?.userId === user.userId ? "own" : "other"}`}
          >
            <div className="sender-name">{msg.sender?.name}</div>
            <div className="message-content">{msg.content}</div>
            <div className="message-time">{formatTime(msg.createdAt)}</div>
          </div>
        ))}
        </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
