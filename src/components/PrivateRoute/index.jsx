import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <></>;
  }
  return user ? <Outlet /> : <Navigate to="login" />;
};
