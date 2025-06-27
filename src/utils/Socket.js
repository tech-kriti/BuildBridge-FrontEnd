import { io } from "socket.io-client";

const socket = io("https://buildbridge-bakend.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;