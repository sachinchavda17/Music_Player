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
        <div className="bg-app-black p-5 h-full rounded text-white">
          <div className="max-w-screen-xl mx-auto flex flex-col gap-5 lg:flex-row justify-center lg:justify-between items-center h-full">
            {/* Image Section */}
            <div className="lg:w-1/3 w-full lg:order-1 flex justify-center">
              <div className="h-60 w-60 flex items-center justify-center">
                <img
                  src={currentSong?.thumbnail}
                  alt={currentSong?.name}
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            </div>

            {/* Song Details & Audio Player Section */}
            <div className="lg:w-2/3 w-full lg:p-8 lg:order-2 flex flex-col items-center lg:items-start justify-between">
              <div className="flex flex-col items-center lg:items-start w-full">
                <h1 className="text-2xl lg:text-3xl font-bold text-lightGray-light mb-2">
                  {currentSong?.name}
                </h1>
                <p className="text-sm text-lightGray text-center lg:text-left">
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
