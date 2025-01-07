import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const authToken = cookies.authToken;
    if (authToken) {
      setIsAuthenticated(true);
      setToken(authToken);
      setUser(JSON.parse(localStorage.getItem("currentUser")) || null);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  const loginCookie = (token) => {
    // Set a persistent cookie with an expiration
    setCookie("authToken", token, {
      path: "/",
      httpOnly: false, // Only secure should be enabled in production
      maxAge: 7 * 24 * 60 * 60, // Cookie expires after 7 days
    });
    setIsAuthenticated(true);
  };

  const logoutCookie = () => {
    removeCookie("authToken", { path: "/" });
    localStorage.removeItem("currentUser");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loginCookie,
        logoutCookie,
        cookies,
        user,
        setUser,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
