import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useAudio } from "../contexts/AudioContext.js";
import { useAuth } from "../contexts/AuthContext.js";
import { getDataApi } from "../utils/serverHelpers.js";
import AudioPlayerControls from "./AudioPlayerControls.js";
import spectrum from "../images/spectrum.gif";
import spectrumPng from "../images/spectrum.png";

const MusicFooter = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    setAudioVolume,
    shuffle,
    toggleShuffle,
  } = useAudio();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isLikedPopover, setIsLikedPopover] = useState(false);
  const [liked, setLiked] = useState(false);
  const { cookies } = useAuth();
  const token = cookies?.authToken;
  const userId = currentUser?._id;
  const songId = currentSong?._id;

  const handleVolumeChange = (e) => {
    setAudioVolume(parseFloat(e.target.value));
  };

  const fetchLikedStatus = async () => {
    try {
      const response = await getDataApi(
        `/song/liked/${userId}/${songId}`,
        token
      );
      const likedStatus =
        response?.liked !== undefined ? response.liked : false;
      setLiked(likedStatus);
    } catch (err) {
      console.error("Error fetching liked status:", err);
      setLiked(false);
    }
  };

  const likeToggleFetch = async () => {
    try {
      const response = await getDataApi(
        `/song/like/${userId}/${songId}`,
        token
      );
      setLiked(response.msg);
    } catch (err) {
      console.error("Error toggling like:", err);
      setLiked("Error toggling like");
    }
  };

  useEffect(() => {
    fetchLikedStatus();
  }, [userId, songId]);

  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-darkGray text-white px-4 py-4 sm:py-2 z-50"
      tabIndex="0"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <Link
          to={"/playedsong"}
          className="flex gap-2 items-center w-full sm:w-1/4"
        >
          <div className="relative w-10 h-10 rounded sm:w-16 sm:h-16 mr-4 flex items-center justify-center">
            {/* Song Thumbnail */}
            <img
              src={currentSong?.thumbnail || "/placeholder.jpg"}
              alt="Song Cover"
              className="w-full h-full object-cover rounded"
            />

            {/* Spectrum Image - Only appears when song is playing */}
            {currentSong && currentSong?._id && (
              <img
                src={isPlaying ? spectrum : spectrumPng}
                alt="spectrum"
                className="absolute top-0 left-0 z-10 bg-transparent h-10 w-10 sm:h-16 sm:w-16 rounded-full"
              />
            )}

            {/* Dark Overlay for Thumbnail */}
            {currentSong && currentSong?._id && (
              <div className="absolute inset-0 bg-black opacity-50 "></div>
            )}
          </div>

          {/* Song Name and Artist */}
          <div>
            <p className="text-sm sm:text-base">
              {currentSong?.name || "No Track"}
            </p>
            <p className="text-sm hidden sm:block">
              {currentSong?.artist?.firstName +
                " " +
                currentSong?.artist?.lastName || "Unknown Artist"}
            </p>
          </div>
        </Link>

        {/* Center Section */}
        <AudioPlayerControls />

        {/* Right Section */}
        <div className="flex items-center justify-end space-x-4 w-1/4">
          {/* Shuffle Icon */}
          <Icon
            icon="mdi:shuffle-variant"
            onClick={() => toggleShuffle()}
            fontSize={25}
            className={`cursor-pointer ${
              shuffle ? "text-primary" : "text-lightGray hover:text-white"
            }`}
          />

          {/* Like Button */}
          <div className="relative">
            <Icon
              onMouseEnter={() => setIsLikedPopover(true)}
              onMouseLeave={() => setIsLikedPopover(false)}
              icon={liked ? "mdi:heart" : "mdi:heart-outline"}
              fontSize={25}
              className={`cursor-pointer ${
                liked ? "text-primary" : "text-lightGray hover:text-white"
              }`}
              onClick={likeToggleFetch}
            />
            {isLikedPopover && (
              <div className="absolute z-10 bottom-0 right-0 mb-8 mr-0 text-sm transition-opacity duration-300 border rounded-lg shadow-sm opacity-100 text-lightGray border-darkGray-light bg-darkGray">
                <div className="px-3 py-2 border-b rounded-t-lg border-darkGray-light bg-darkGray-light">
                  <h3 className="font-semibold text-lightGray-light">
                    {liked ? "Liked" : "Not Liked"}
                  </h3>
                </div>
              </div>
            )}
          </div>

          {/* Volume Control */}
          <div className="relative">
            <button
              onMouseEnter={() => setIsPopoverVisible(true)}
              onMouseLeave={() => setIsPopoverVisible(false)}
            >
              <Icon
                icon={volume === 0 ? "bi:volume-mute" : "bi:volume-up"}
                fontSize={25}
                className={`cursor-pointer ${
                  volume === 0
                    ? "text-lightGray"
                    : volume < 0.5
                    ? "text-lightGray-light"
                    : "text-white"
                } hover:text-gray-100 hidden sm:block`}
              />
            </button>

            {isPopoverVisible && (
              <div className="absolute z-10 bottom-0 right-0 mb-8 mr-0 text-sm transition-opacity duration-300 border rounded-lg shadow-sm opacity-100 text-lightGray border-darkGray-light bg-darkGray">
                <div className="px-3 py-2 border-b rounded-t-lg border-darkGray-light bg-darkGray-light">
                  <h3 className="font-semibold text-lightGray-light">
                    {(volume * 100).toFixed(0)}%
                  </h3>
                </div>
              </div>
            )}
          </div>

          {/* Volume Slider */}
          <input
            style={{
              background: `linear-gradient(to right, #e42012 ${
                volume * 100
              }%, lightgray ${volume}%)`,
            }}
            className="appearance-none h-2 rounded bg-lightGray hidden sm:block"
            type="range"
            value={volume}
            onChange={handleVolumeChange}
            min="0"
            max="1"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicFooter;
