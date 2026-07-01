import React, { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { SuccessScreen } from "./Login/Login";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  const [showSuccess, setShowSuccess] = useState(!!location.state?.showSuccessOverlay);
  const successData = location.state?.successData;

  const handleOverlayFinish = () => {
    setShowSuccess(false);
  };

  const overlay = showSuccess ? (
    <SuccessScreen 
      type={successData?.type} 
      userName={successData?.name} 
      onContinue={handleOverlayFinish} 
    />
  ) : null;

  if (loading) {
    return (
      <>
        {overlay}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
        </div>
      </>
    );
  }

  return isAuthenticated ? (
    <>
      {overlay}
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}
