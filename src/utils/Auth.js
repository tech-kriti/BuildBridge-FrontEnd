// src/hooks/useAuth.js
import { useSelector } from 'react-redux';

const useAuth = () => {
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = !!token;
   console.log("issuth",!!token)
  return { token, user, isAuthenticated };
};

export default useAuth;
