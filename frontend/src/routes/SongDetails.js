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
        <div className="bg-app-black p-5 h-full rounded text-white ">
          <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-around h-full">
            <div className="lg:py-8 lg:order-1">
              <div className="h-60 w-60">
                <img
                  src={currentSong?.thumbnail}
                  alt={currentSong?.name}
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            </div>

            <div className="lg:w-3/4 w-full lg:p-8 lg:order-2 flex flex-col items-start justify-between">
              <div className="flex items-center justify-center flex-col w-full">
                <h1 className="text-3xl font-bold text-lightGray-light mb-2">
                  {currentSong?.name}
                </h1>
                <p className="text-sm text-lightGray">
                  {currentSong?.artist?.firstName}{" "}
                  {currentSong?.artist?.lastName}
                </p>
              </div>
              <AudioPlayerControls player={true} />
            </div>
          </div>
        </div>
      )}
    </LoggedInContainer>
  );
}
