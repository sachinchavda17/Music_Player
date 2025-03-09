import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { getDataApi } from "../utils/serverHelpers";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [songData, setSongData] = useState([]);
  const [user, setUser] = useState({});
  const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshMain, setRefreshMain] = useState(false);
  
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

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await getDataApi("/song/get/allsong");
        if (response?.data) {
          setSongData(response.data);
        } else {
          toast.error("No songs available.");
        }
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false); // Set loading to false once the fetching is complete
      }
    };

    getData();
  }, [token, refreshMain]);

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
        songData,
        loading,
        setRefreshMain,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
