import { useState, useEffect } from "react";
import SingleSongCard from "../components/SingleSongCard";
import { getDataApi } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";
import { useSongApi } from "../contexts/SongApiContext";

const LikedSongs = () => {
  const { loading, likedSongs } = useSongApi(); // Corrected the name here

  return (
    <LoggedInContainer curActiveScreen="likedsong">
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="text-white text-2xl font-semibold pb-4 pl-2 sm:pt-5">
            Your Liked Song
          </div>
          {likedSongs.length === 0 ? ( // Corrected the variable name here
            <div className="text-lightGray text-lg pl-2">
              You haven't liked any song till now.
            </div>
          ) : (
            <div className="space-y-3 overflow-auto">
              {likedSongs.map((item) => (
                <SingleSongCard
                  info={item}
                  songList={likedSongs} // Passing the correct variable here
                  key={item._id} // Use a unique identifier (e.g., `id`) as key
                />
              ))}
            </div>
          )}
        </div>
      )}
    </LoggedInContainer>
  );
};

export default LikedSongs;
