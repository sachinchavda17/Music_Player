import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAudio } from "../contexts/AudioContext";
import spectrum from "../images/spectrum.gif";
import spectrumPng from "../images/spectrum.png";
import { useCookies } from "react-cookie";
const SingleSongBox = ({ item, songList, ListKey, edit }) => {
  const { play, currentSong, setPlaylist, isPlaying } = useAudio() || {};
  const [cookie, setCookie] = useCookies(["token"]);

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(cookie.token));
  const songId = item?._id;

  const handlePlay = () => {
    if (!edit && isLoggedIn) {
      // Set the current playlist dynamically when the user plays a song
      setPlaylist(songList);
      play(item);
    }
  };
  return (
    <div
      className="flex p-1 sm:p-2 rounded-sm w-full justify-between space-x-4  "
      onClick={handlePlay}
      key={ListKey}
    >
      <div className="bg-black bg-opacity-40 w-full relative  rounded-lg hover:bg-lightGray hover:bg-opacity-20">
        <div className="overflow-hidden">
          <img
            className="h-34 sm:h-44 lg:h-52  w-full transform scale-100 hover:scale-110 transition-transform duration-10 "
            src={item?.thumbnail}
            alt="label"
          />
        </div>
        {currentSong && currentSong?._id === item?._id && (
          // <div className="text-primary font-bold">Now Playing</div>
          <img
            src={isPlaying ? spectrum : spectrumPng}
            alt="spectrum"
            className="absolute top-0 right-0 rounded-full bg-transparent h-10 "
          />
        )}
        <div className="px-4 py-3">
          <div className="text-lightGray-light text-sm sm:text-base font-semibold py-1">
            {item?.name}
          </div>
          <div className="text-lightGray  text-xs sm:text-sm py-1">
            {item?.artist?.firstName + " " + item?.artist?.lastName}
          </div>
          {edit && (
            <Link to={`/edit/${songId}`}>
              <div className="bg-primary text-lightGray-light border border-darkGray rounded-lg p-2 w-full text-center cursor-pointer flex justify-center items-center space-x-2 ">
                <span>Edit</span>
                <Icon
                  icon={"bitcoin-icons:edit-filled"}
                  className={`text-lightGray hover:text-lightGray`}
                  fontSize={25}
                />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleSongBox;
