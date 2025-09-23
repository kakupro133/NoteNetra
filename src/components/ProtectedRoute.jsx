import React from 'react';
import { Navigate } from 'react-router-dom';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { useEffect, useState } from 'react'; // Removed duplicate import
import { Spinner } from './ui/Spinner'; // Assuming you have a Spinner component

const ProtectedRoute = ({ children }) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setIsAuthenticated(!!user);
  //     setLoading(false);
  //   });
  //   return () => unsubscribe();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <Spinner size="lg" />
  //     </div>
  //   );
  // }

  // For demonstration, always consider the user authenticated
  // In a real app, you'd replace this with actual auth logic
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <Navigate to="/login-page" replace />;
  }

  return children;
};

export default ProtectedRoute;
