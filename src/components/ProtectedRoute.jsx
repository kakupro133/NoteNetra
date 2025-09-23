import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spinner } from './ui/Spinner'; // Assuming you have a Spinner component

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Redirect to login page if not authenticated
        // Using Navigate component is more appropriate here within RouterRoutes
        // navigate('/login-page'); 
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, navigate]);

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
