import React from "react";
import { useLoading } from "../../context/LoadingContext";
import "./index.scss";

export const LoadingOverlay = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
};
