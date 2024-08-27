import React, { useEffect  } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth  } from 'AuthProvider'; 


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Render a loading indicator or return null to delay rendering
    return <div>Loading...</div>; // Or simply return null;
  }


  if (!isAuthenticated) {
   
    return <Navigate to="/pages/login/login3" replace />;
  }

  return children;
};


export default ProtectedRoute;