import React, { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { getDataApi } from "../utils/serverHelpers";

const SongApiContext = createContext();

export const useSongApi = () => useContext(SongApiContext);

export const SongApiProvider = ({ children }) => {
  const [mySongs, setMySongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = cookies.authToken;
    if (authToken) {
      setToken(authToken);
    }
  }, [cookies.authToken]); // Set token only when authToken changes, no need to depend on 'token' itself

  useEffect(() => {
    if (!token) return; // Don't run if there's no token yet

    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        // Fetch my songs
        const mySongsResponse = await getDataApi("/song/get/mysongs", token);
        setMySongs(mySongsResponse.data);

        // Fetch liked songs
        const likedSongsResponse = await getDataApi("/song/likesongs", token);
        setLikedSongs(likedSongsResponse.data);
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false); // Stop loading after both requests are done
      }
    };

    fetchData();
  }, [token]); // Runs when the token changes

  return (
    <SongApiContext.Provider
      value={{
        mySongs,
        likedSongs,
        loading,
      }}
    >
      {children}
    </SongApiContext.Provider>
  );
};
