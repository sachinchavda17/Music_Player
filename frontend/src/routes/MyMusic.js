import { useState, useEffect } from "react";
import SingleSongCard from "../components/SingleSongCard";
import { getDataApi } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";
import { useSongApi } from "../contexts/SongApiContext";

const MyMusic = () => {
  const { mySongs, loading } = useSongApi();

  return (
    <LoggedInContainer curActiveScreen="myMusic">
      {loading ? (
        <Loading />
      ) : (
        <div className={""}>
          <div
            className={`text-white text-2xl font-semibold pb-4 pl-2 sm:pt-5`}
          >
            My Songs
          </div>
          {mySongs.length === 0 ? (
            <div className="text-lightGray text-lg pl-2">
              You haven't upload song.
            </div>
          ) : (
            <div className="space-y-3 overflow-auto">
              {mySongs.map((item) => (
                <SingleSongCard
                  info={item}
                  songList={mySongs}
                  key={JSON.stringify(item)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </LoggedInContainer>
  );
};

export default MyMusic;
