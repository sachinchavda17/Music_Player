import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import SingleSongBox from "../components/SingleSongBox";
import { getDataApi } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";
import { useSongApi } from "../contexts/SongApiContext";

const EditPage = () => {
  const { loading, mySongs } = useSongApi();

  return (
    <LoggedInContainer curActiveScreen="edit">
      {loading ? (
        <Loading />
      ) : (
        <div className={`bg-app-black`}>
          <div className="text-white text-2xl font-semibold pb-4 pl-2 sm:pt-5">
            Edit Your Songs
          </div>
          {mySongs?.length === 0 ? (
            <div className="text-lightGray text-lg pl-2">
              You haven't upload song till now.
            </div>
          ) : (
            <div className="grid gap-2 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 overflow-auto max-lg:grid-cols-3 max-md:grid-cols-2">
              {mySongs.map((item) => (
                <SingleSongBox
                  item={item}
                  edit={1}
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

export default EditPage;
