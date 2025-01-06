import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDataApi, postDataApi } from "../utils/serverHelpers";
import CloudinaryUpload from "./CloudinaryUpload";
import Loading from "./Loading";
import { Icon } from "@iconify/react";
import LoggedInContainer from "../containers/LoggedInContainer";
import { toast } from "react-toastify";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";

const EditSongPage = () => {
  const [name, setName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [trackName, setTrackName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailName, setThumbnailName] = useState();
  const [song, setSong] = useState([]);
  const { songId } = useParams();
  const [loading, setLoading] = useState(null);
  const [buttonLoadingUpdate, setButtonLoadingUpdate] = useState(null);
  const [buttonLoadingDelete, setButtonLoadingDelete] = useState(null);

  const { currentSong } = useAudio();
  const { cookies } = useAuth();
  const token = cookies?.authToken;
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await getDataApi("/song/edit/" + songId, token);
        setSong(response.data);
      } catch (err) {
        toast.error("Error fetching song data");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [songId]);

  const submitProject = async () => {
    try {
      const data = {
        name: name,
        thumbnail: thumbnail,
        track: trackUrl,
      };
      setButtonLoadingUpdate(true);

      if (data.name === "") {
        data.name = song.name || "";
      }
      if (data.thumbnail === "") {
        data.thumbnail = song.thumbnail || "";
      }
      if (data.track === "") {
        data.track = song.track || "";
      }

      const response = await postDataApi(
        "/song/edit/" + songId + "/update",
        data,
        token
      );

      setButtonLoadingUpdate(false);
      if (response.err) {
        setButtonLoadingUpdate(false);
        toast.error("Could not update Song");
      } else {
        setButtonLoadingUpdate(false);
        toast.success("Song Updated.");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      setButtonLoadingUpdate(false);
      toast.error("Could not update Song");
    }
  };

  const deleteProject = async () => {
    try {
      setButtonLoadingDelete(true);
      await getDataApi("/song/edit/" + songId + "/delete", token);
      toast.success("Song deleted successfully");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      toast.error("Could not delete Song");
    } finally {
      setButtonLoadingDelete(false);
    }
  };

  return (
    <LoggedInContainer curActiveScreen={"edit"}>
      {loading ? (
        <Loading />
      ) : (
        <div
          className={`upload-container ${
            currentSong ? "mb-20" : ""
          } w-full h-full flex flex-col items-center bg-black overflow-auto`}
        >
          <div className="form bg-app-black text-white p-6 my-2 lg:px-12 rounded-lg shadow-md w-11/12 md:w-3/4 lg:w-1/2 ">
            <h1 className="w-full text-lightGray-light text-xl border-b border-darkGray-light pb-2 text-center">
              Editing {song.name}
            </h1>
            <div className="my-3">
              <label className="text-lightGray-light " htmlFor="name">
                Name
              </label>
              <input
                className="my-2 px-4 py-2 text-lightGray-light bg-darkGray rounded focus:outline-none border-none w-full"
                type="text"
                name="name"
                placeholder="Edit song name"
                value={name === "" ? song.name || "" : name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="my-3">
              <label className="text-lightGray-light " htmlFor="thumbnail">
                Edit Thumbnail
              </label>
              <div className="flex items-center justify-center">
                <img
                  src={trackUrl ? trackUrl : song.thumbnail}
                  alt={trackUrl ? trackUrl : song.thumbnail}
                  className="  my-2 w-full md:w-40 md:h-40  rounded"
                />
              </div>
              <div className="py-1">
                {thumbnailName ? (
                  <div className="bg-primary rounded p-3 ">
                    {thumbnailName.substring(0, 35)}...
                  </div>
                ) : (
                  <CloudinaryUpload
                    edit={1}
                    setUrl={setThumbnail} // Use setImgUrl for thumbnail
                    setName={setThumbnailName} // Use setUploadedFileName for name
                    displayName={"Select New Thumbnail"}
                  />
                )}
              </div>
            </div>
            <div className="my-3">
              <label className="text-lightGray-light " htmlFor="text">
                Edit Track
              </label>
              <div class="my-2">
                <audio controls preload="none" className="w-full ">
                  <source
                    src={trackUrl ? trackUrl : song.track}
                    type="audio/mp3"
                  />
                </audio>
              </div>
              <div className="my-2">
                {trackName ? (
                  <div className="bg-primary rounded-full p-3  ">
                    {trackName.substring(0, 50)}...
                  </div>
                ) : (
                  <CloudinaryUpload
                    edit={1}
                    setUrl={setTrackUrl}
                    setName={setTrackName}
                    displayName={"Select New Track"}
                  />
                )}
              </div>
            </div>

            <div className="edit-btns flex  py-3 justify-around">
              <button
                disabled={buttonLoadingUpdate}
                type="submit"
                className="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
                onClick={submitProject}
              >
                {buttonLoadingUpdate ? (
                  <div className="px-3 py-0">
                    <Icon
                      icon="line-md:loading-alt-loop"
                      color="#eee"
                      width="27"
                      height="27"
                    />
                  </div>
                ) : (
                  "Update"
                )}
              </button>
              <button
                disabled={buttonLoadingDelete}
                type="delete"
                className="btn bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
                onClick={deleteProject}
              >
                {buttonLoadingDelete ? (
                  <div className="px-3 py-0">
                    <Icon
                      icon="line-md:loading-alt-loop"
                      color="#eee"
                      width="27"
                      height="27"
                    />
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </LoggedInContainer>
  );
};

export default EditSongPage;
