import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Guard wrapper for authenticated routes.
 * Reads token from Redux store (hydrated from localStorage on startup).
 * Unauthenticated users are redirected to /login.
 * Authenticated users see the nested <Outlet />.
 */
const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
