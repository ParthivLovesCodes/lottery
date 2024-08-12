import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./index.scss";

export const AdminNavbar = () => {
  const { signOutUser } = useAuth();

  const navigateToAdminPage = () => {
    window.location.href = "/admin";
  };

  return (
    <div className="top">
      <div className="top-content">
        <span
          className="admin-title"
          onClick={navigateToAdminPage}
        >
          Admin Dashboard
        </span>
        <button
          className="logout-btn"
          onClick={signOutUser}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
