import { useContext, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, Navigate } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import { useAudio } from "../contexts/AudioContext";
import AudioPlayerControls from "../components/AudioPlayerControls";

export default function SongDetails() {
  const { currentSong } = useAudio();
  return (
    <LoggedInContainer curActiveScreen={"home"}>
      {!currentSong ? (
        <Navigate to={"/"} replace={true} />
      ) : (
        <div className="bg-black p-5 h-full rounded text-white ">
          <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row h-full">
            <div className="lg:py-8 lg:order-1  ">
              {/* <div className="aspect-w-4 aspect-h-5 lg:aspect-w-1 lg:aspect-h-1"> */}
              <div className="h-60 w-60">
                <img
                  src={currentSong?.thumbnail}
                  alt={currentSong?.name}
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            </div>

            <div className="lg:w-3/4 w-full lg:p-8 lg:order-2 flex flex-col items-start  ">
              <h1 className="text-3xl font-bold text-lightGray-light mb-2">
                {currentSong?.name}
              </h1>
              <p className="text-sm text-lightGray">
                {currentSong?.artist?.firstName} {currentSong?.artist?.lastName}
              </p>
              <AudioPlayerControls player={true} />
              {/* <p className="text-sm text-lightGray mt-2">
                <a
                  href={currentSong?.track}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-lightGray-light"
                >
                  Listen on BeatFlow
                </a>
              </p> */}

              {/* <div className="mt-8 flex justify-center lg:justify-start">
              <Link
                to="/"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
              >
                Back to Home
              </Link>
            </div> */}
            </div>
          </div>
        </div>
      )}
    </LoggedInContainer>
  );
}
