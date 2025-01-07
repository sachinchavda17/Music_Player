import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAudio } from "../contexts/AudioContext";
import spectrum from "../images/spectrum.gif";
import spectrumPng from "../images/spectrum.png";
import { useAuth } from "../contexts/AuthContext";

const SingleSongBox = ({ item, songList, edit }) => {
  const { play, currentSong, setPlaylist, isPlaying } = useAudio() || {};
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const songId = item?._id;

  const handleClick = () => {
    if (isAuthenticated) {
      if (!edit) {
        setPlaylist(songList);
        play(item);
      }
    } else {
      navigate("/login");
    }
  };
  return (
    <div
      className="flex p-1 sm:p-2 rounded-sm w-full justify-between space-x-4  "
      onClick={handleClick}
    >
      <div className="bg-black bg-opacity-40 w-full relative  rounded-lg hover:bg-lightGray hover:bg-opacity-20">
        <div className="overflow-hidden">
          <img
            className="h-34 sm:h-44 lg:h-52 z-10 w-full transform scale-100 hover:scale-110 transition-transform duration-10 "
            src={item?.thumbnail}
            alt="label"
          />
          {currentSong && currentSong?._id === item?._id && (
            // <div className="text-primary font-bold">Now Playing</div>
            <>
              <img
                src={isPlaying ? spectrum : spectrumPng}
                alt="spectrum"
                className="z-10 absolute top-0 right-0 rounded-full bg-transparent h-10 "
              />
              <div className="z-0 absolute inset-0 bg-black opacity-50 w-full h-full "></div>
            </>
          )}
        </div>

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
