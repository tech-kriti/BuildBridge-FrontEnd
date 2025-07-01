import logo from './logo.svg';
import './App.css';
import UnauthDashboard from './pages/Unauthenticate';
import { Route, Routes } from 'react-router-dom';
import Register from './component/chatboat/chatboatResgister.js';
import Login from './component/chatboat/chatboatlogin.js'
import AuthDashboard from './pages/authdashboard.js';
import PrivateRoute from './component/PrivateRoute.js';
import MyProjects from './component/projects/Myproject.js';
import Feed from './component/dashbody/body.js';
import ViewDetails from './component/projects/ViewProjectDetails.js';
import AddProject from './component/projects/Addproject.js';
import ViewProfile from './component/Profile/Viewprofile.js';
import UpdateProfile from './component/Profile/UpdateProfile.js';
import AddEducation from './component/Profile/AddEducation.js';
import AddSkill from './component/Profile/AddSkill.js';
import EditProject from './component/projects/UpdateProject.js';
import { ToastContainer ,toast} from 'react-toastify';
import Notifications from './component/dashbody/Notification.js';
import ChatRoom from './component/projects/ChatRomm.js';
import ForgotPassword from './component/chatboat/forgot.js';
import VerifyOtp from './component/chatboat/verify.js';
import ResetPassword from './component/chatboat/reset.js';
import useAuth from './utils/Auth.js';
import { useEffect } from 'react';
import socket from './utils/Socket.js';
import { useDispatch } from 'react-redux';
import { fetchNotifications } from './react-redux/notificationSlice.js';


function App() {




  const { user , token} = useAuth();
  const dispatch=useDispatch();
  const id = user?.userId||user?.id;

 useEffect(() => {
  if ((user?.userId||user?.id)) {
    socket.connect();
    console.log("🔌 Socket connected manually");

    // Join user's notification room
    socket.emit("joinNotificationRoom", (user.userId||user?.id))
    console.log("📨 Joined notification room:", `user_${user.userId||user.id}`);

    // Listen for connection confirmation
    socket.on("connect", () => {
      console.log("✅ Connected to socket server");
    });

    // Listen for real-time notifications
    socket.on("new_notification", (data) => {
      console.log("📥 Received notification via socket:", data);
      toast.info(`🔔 ${data.message || "New notification"}`, {
        position: "top-right",
        autoClose: 3000,
      });

      // Optional: Update Redux
      dispatch(fetchNotifications(token));
    });
  }

  return () => {
    socket.disconnect();
    console.log("🔌 Socket disconnected");
    socket.off("new_notification");
    socket.off("connect");
  };
}, [id, dispatch,token]);
  return <>
        <ToastContainer />

  <Routes>
  <Route path="/" element={<UnauthDashboard/>} />
  <Route path="/register" element={<Register/>}></Route>
  <Route path="/login"element={<Login/>}></Route>
  <Route path="/forgot-password"element={<ForgotPassword/>}></Route>
   <Route path="/verify-otp"element={<VerifyOtp/>}></Route>
    <Route path="/reset-password"element={<ResetPassword/>}></Route>
    <Route path="/home/*" element={<PrivateRoute><AuthDashboard /></PrivateRoute>}>
  <Route index element={<Feed />} />
  <Route path="my-projects" element={<MyProjects />} />
  <Route path='project/:id' element={<ViewDetails/>}/>
  <Route path='add-project' element={<AddProject/>}/>
  <Route path='profile' element={<ViewProfile/>}/>
  <Route path='create-profile' element={<UpdateProfile/>}/>
   <Route path='add-education' element={<AddEducation/>}/>
    <Route path='add-skill' element={<AddSkill/>}/>
    <Route path="edit-project/:id" element={<EditProject/>} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="chatroom/:id" element={<ChatRoom/>} />
    <Route path='view-profile/:idd' element={<ViewProfile/>}/>
    
</Route>
  </Routes>
   
  </>
}

export default App;
