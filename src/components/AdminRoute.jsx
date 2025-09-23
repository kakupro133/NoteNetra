import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner } from './ui/Spinner';
import AppIcon from './AppIcon';

const AdminRoute = ({ children }) => {
  const [user, loadingAuth, errorAuth] = useEffect(null, null, null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);
  const [errorRole, setErrorRole] = useState(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        try {
          // const userDocRef = doc(db, 'users', user.uid);
          // const userDocSnap = await getDoc(userDocRef);
          const emailIsConfiguredAdmin = (user.email === 'killnoymous@gmail.com');
          if (emailIsConfiguredAdmin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
          setErrorRole("Failed to verify admin privileges.");
          setIsAdmin(false);
        } finally {
          setLoadingRole(false);
        }
      } else {
        setIsAdmin(false);
        setLoadingRole(false);
      }
    };

    if (!loadingAuth) {
      checkAdminRole();
    }
  }, [user, loadingAuth]);

  // if (loadingAuth || loadingRole) {
  //   return <div className="flex justify-center items-center h-screen text-lg">Checking permissions...</div>;
  // }

  // if (errorAuth || errorRole) {
  //   return <div className="flex justify-center items-center h-screen text-red-500 text-lg">Error: {errorAuth?.message || errorRole}</div>;
  // }

  // For demonstration, assume admin for now.
  const isAdmin = true; 

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;
