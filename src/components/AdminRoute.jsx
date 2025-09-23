import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner } from './ui/Spinner';
import AppIcon from './AppIcon';

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);
  // For demonstration, assume admin for now.
  useEffect(() => {
    setIsAdmin(true); // Always true for demo
    setLoadingRole(false);
  }, []);

  if (loadingRole) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;
