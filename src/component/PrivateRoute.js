import react, { Children } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../utils/Auth.js";

const PrivateRoute =({children})=>{
     const { isAuthenticated } = useAuth();
    return isAuthenticated ?children: <Navigate to={"/login"}></Navigate>

};
export default PrivateRoute;