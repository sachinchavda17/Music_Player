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
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const authToken = cookies.authToken;
    if (authToken) {
      setToken(authToken);
    }
  }, [cookies.authToken]);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const mySongsResponse = await getDataApi("/song/get/mysongs", token);
        setMySongs(mySongsResponse.data);

        const likedSongsResponse = await getDataApi("/song/likesongs", token);
        console.log(likedSongsResponse)
        if(likedSongsResponse.success){
          setLikedSongs(likedSongsResponse.data);
        }else{
          toast.error(likedSongsResponse.err)
          setLikedSongs([])
        }
        console.log(likedSongsResponse)
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [token, refresh]); 

  return (
    <SongApiContext.Provider
      value={{
        mySongs,
        likedSongs,
        loading,
        setRefresh,
      }}
    >
      {children}
    </SongApiContext.Provider>
  );
};
