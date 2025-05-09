import { useGlobalContext } from "../hooks/useGlobalContext";
import { Navigate } from "react-router-dom";
const ProtectedRoutes = ({ children }) => {
  const { user, isAuthReady } = useGlobalContext();

  if (!isAuthReady) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;
