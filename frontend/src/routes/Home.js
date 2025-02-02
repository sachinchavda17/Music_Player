import { getDataApi } from "../utils/serverHelpers";
import { useState, useEffect } from "react";
import SingleSongBox from "../components/SingleSongBox";
import LoggedInContainer from "../containers/LoggedInContainer";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import SongNotAvailable from "../components/SongNotAvailable";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext";

const Home = () => {
  const { songData, loading } = useAuth();

  return (
    <LoggedInContainer curActiveScreen="home">
      {loading ? (
        <Loading />
      ) : songData.length === 0 ? (
        <SongNotAvailable />
      ) : (
        <div
          className={`pt-2 grid gap-2 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 overflow-auto max-lg:grid-cols-3 max-md:grid-cols-2`}
        >
          {songData.map((item, ind) => (
            <SingleSongBox item={item} songList={songData} key={ind} />
          ))}
        </div>
      )}
    </LoggedInContainer>
  );
};

export default Home;
