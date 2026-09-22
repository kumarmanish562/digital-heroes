import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "./Loading";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const { loading, isAuthenticated, role } = useAuth();

  if (loading) return <Loading label="Checking session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && role !== "ADMIN") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
