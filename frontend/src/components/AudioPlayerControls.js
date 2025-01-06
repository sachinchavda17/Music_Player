import React from "react";
import { Icon } from "@iconify/react";
import { useAudio } from "../contexts/AudioContext";
import { secondsToHms } from "../containers/functionContainer.js";

const AudioPlayerControls = ({ player = false }) => {
  const {
    isPlaying,
    togglePlayPause,
    seekTo,
    progress,
    duration,
    nextTrack,
    prevTrack,
  } = useAudio();

  const handleSeekChange = (value) => {
    const newTime = (value / 100) * duration;
    seekTo(newTime);
  };

  return (
    <div
      className={`flex items-center justify-center flex-col ${
        player ? "w-full space-y-2 mt-5" : "w-1/4 sm:w-2/3 sm:space-x-4"
      }`}
    >
      {/* Control Buttons */}
      <div
        className={`flex items-center ${player ? "gap-4" : "sm:space-x-4"}`}
      >
        {/* Previous Track */}
        <button onClick={prevTrack} className="">
          <Icon
            icon="bi:skip-backward"
            fontSize={25}
            className={`cursor-pointer text-lightGray hover:text-white ${
              player || "hidden sm:block"
            }`}
          />
        </button>

        {/* Play/Pause Button */}
        <button onClick={togglePlayPause} className="text-3xl">
          {/* Desktop */}
          <Icon
            icon={
              isPlaying ? "ic:baseline-pause-circle" : "ic:baseline-play-circle"
            }
            fontSize={50}
            className={`cursor-pointer text-white ${
              player || "hidden sm:block"
            }`}
          />
          {/* Mobile */}
          <Icon
            icon={isPlaying ? "solar:pause-bold" : "solar:play-bold"}
            fontSize={25}
            className={`cursor-pointer text-white ${
              player ? "hidden" : "sm:hidden"
            }`}
          />
        </button>

        {/* Next Track */}
        <button onClick={nextTrack}>
          <Icon
            icon="bi:skip-forward"
            fontSize={25}
            className={`cursor-pointer text-lightGray hover:text-white ${
              player || "hidden sm:block"
            }`}
          />
        </button>
      </div>

      {/* Progress Bar */}
      <div
        className={`${
          player ? "w-full" : "hidden sm:flex space-x-4"
        } items-center justify-between  w-full`}
      >
        <div
          className={player ? "flex items-center justify-between" : "hidden"}
        >
          <span className="w-12 text-sm">{secondsToHms(progress)}</span>
          <span className="w-12 text-sm">{secondsToHms(duration)}</span>
        </div>
        <span className={player ? "hidden" : " w-12 text-sm"}>
          {secondsToHms(progress)}
        </span>
        <input
          type="range"
          value={(progress / duration) * 100 || 0}
          onChange={(e) => handleSeekChange(e.target.value)}
          min="0"
          max="100"
          style={{
            background: `linear-gradient(to right, #e42012 ${
              (progress / duration) * 100 || 0
            }%, lightgray ${(progress / duration) * 100 || 0}%)`,
          }}
          className="w-full cursor-pointer rounded appearance-none h-2 transition-none"
        />
        <span className={player ? "hidden" : " w-12 text-sm"}>
          {secondsToHms(duration)}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayerControls;
