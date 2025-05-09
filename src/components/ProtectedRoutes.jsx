import { Navigate } from "react-router-dom";

function ProtectedRoutest({ user, children }) {
  if (user) {
    return children;
  } else{
       return <Navigate to="/login"/>

  }
}

export default ProtectedRoutest;