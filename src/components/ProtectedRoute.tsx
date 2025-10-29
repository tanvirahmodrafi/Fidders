import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // No token → send user to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

