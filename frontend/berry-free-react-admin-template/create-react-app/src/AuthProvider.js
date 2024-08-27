import React, { createContext, useContext, useState, useEffect  } from 'react';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const login = (token) => {
    localStorage.setItem("jwtToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
  };

  const checkToken = () => {
    const token = localStorage.getItem("jwtToken");
    
    if (token) {
      try {
        // Optional decoding and validation
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Time in seconds

       
       
        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
         
        } else {
          
          setIsAuthenticated(false);
          localStorage.removeItem("jwtToken"); // Remove expired token
        }
      } catch (error) {
       
        setIsAuthenticated(false);
      }
    } else {
     
      setIsAuthenticated(false);
    }
   
    setIsLoading(false);
  };


  useEffect(() => {
    
    checkToken();
  }, []);

  useEffect(() => {
    
  }, [isAuthenticated]);


  return (
    <AuthContext.Provider value={{ isAuthenticated,isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;