import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  deleteDataApi,
  fileUploadHandler,
  getDataApi,
} from "../utils/serverHelpers";
import Loading from "./Loading";
import { Icon } from "@iconify/react";
import LoggedInContainer from "../containers/LoggedInContainer";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const SongFormPage = () => {
  const [name, setName] = useState("");
  const [trackFile, setTrackFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [trackURL, setTrackURL] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const { songId } = useParams();
  const { cookies } = useAuth();
  const token = cookies?.authToken;
  const navigate = useNavigate();

  useEffect(() => {
    if (songId) {
      const fetchSongData = async () => {
        setLoading(true);
        try {
          const response = await getDataApi(`/song/${songId}`, token);
          if (response.success) {
            setName(response.song.name);
            setThumbnailURL(response.song.thumbnail);
            setTrackURL(response.song.track);
          }
        } catch (error) {
          toast.error("Error fetching song data");
        } finally {
          setLoading(false);
        }
      };
      fetchSongData();
    } else {
      setName("");
      setThumbnailURL(null);
      setTrackURL(null);
      setTrackURL("");
      setThumbnailURL("");
    }
  }, [songId]);

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Please provide a song name");
      return;
    }

    try {
      setButtonLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (trackFile instanceof File) formData.append("track", trackFile);
      else if (trackURL) formData.append("track", trackURL);

      if (thumbnailFile instanceof File)
        formData.append("thumbnail", thumbnailFile);
      else if (thumbnailURL) formData.append("thumbnail", thumbnailURL);

      const url = songId ? `/song/edit/${songId}/update` : `/song/create-new`;
      const method = songId ? "put" : "post";

      const response = await fileUploadHandler(url, method, formData, token);

      toast.success(response.message || "Operation successful");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setButtonLoading(true);
      const response = await deleteDataApi(
        `/song/edit/${songId}/delete`,
        token
      );
      if (response.success) {
        toast.success("Song deleted successfully");
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(response.err || "Error while deleting song.");
      }
    } catch {
      toast.error("Could not delete song");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <LoggedInContainer curActiveScreen={songId ? "edit" : "create"}>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center bg-gradient-to-br  min-h-screen ">
          <div className="form bg-app-black text-white p-6 lg:px-12 rounded-lg shadow-lg w-full ">
            <h1 className="text-3xl text-center border-b border-darkGray-light pb-3 mb-6 text-lightGray-light">
              {songId ? `Editing "${name}"` : "Create New Song"}
            </h1>
            <div className="flex flex-col lg:flex-row gap-6 ">
              {/* Form Section */}
              <div className="order-2 lg:order-1 flex-1">
                <div className="mb-6">
                  <label className="text-lightGray-light">Song Name</label>
                  <input
                    className="mt-2 px-4 py-3 bg-darkGray rounded focus:outline-none border-none w-full"
                    type="text"
                    placeholder="Enter song name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label className="text-lightGray-light">Thumbnail</label>
                  <div className="flex flex-col">
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-lightGray-light hover:file:bg-primary-light transition"
                      onChange={(e) => setThumbnailFile(e.target.files[0])}
                    />
                    <input
                      type="url"
                      className="mt-2 px-4 py-3 bg-darkGray rounded focus:outline-none border-none w-full"
                      placeholder="OR Enter thumbnail URL"
                      value={thumbnailURL}
                      onChange={(e) => setThumbnailURL(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="text-lightGray-light">Track</label>
                  <div className="flex flex-col">
                    <input
                      type="file"
                      accept="audio/*"
                      className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-lightGray-light hover:file:bg-primary-light transition"
                      onChange={(e) => setTrackFile(e.target.files[0])}
                    />
                    <input
                      type="url"
                      className="mt-2 px-4 py-3 bg-darkGray rounded focus:outline-none border-none w-full"
                      placeholder="OR Enter track URL"
                      value={trackURL}
                      onChange={(e) => setTrackURL(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {/* Preview Section */}
              <div className="order-1 lg:order-2 flex-1 bg-darkGray p-4 rounded-lg">
                <h2 className="text-xl mb-4 text-center text-lightGray-light">
                  Preview
                </h2>
                <div className="flex flex-col items-center gap-4">
                  {thumbnailFile || thumbnailURL ? (
                    <img
                      src={
                        thumbnailFile instanceof File
                          ? URL.createObjectURL(thumbnailFile)
                          : thumbnailURL
                      }
                      alt="Thumbnail"
                      className="rounded w-40 h-40 object-cover"
                    />
                  ) : (
                    <p className="text-gray-400">No thumbnail selected</p>
                  )}
                  {trackFile || trackURL ? (
                    <audio
                      controls
                      preload="none"
                      className="w-full bg-gray-800 rounded"
                    >
                      <source
                        src={
                          trackFile instanceof File
                            ? URL.createObjectURL(trackFile)
                            : trackURL
                        }
                        type="audio/mpeg"
                      />
                    </audio>
                  ) : (
                    <p className="text-gray-400">No track selected</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-around mt-8">
              <button
                disabled={buttonLoading}
                onClick={handleSubmit}
                className="btn bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded transition-all"
              >
                {buttonLoading ? (
                  <Icon
                    icon="line-md:loading-alt-loop"
                    color="#eee"
                    width="27"
                    height="27"
                  />
                ) : songId ? (
                  "Update Song"
                ) : (
                  "Create Song"
                )}
              </button>
              {songId && (
                <button
                  disabled={buttonLoading}
                  onClick={handleDelete}
                  className="btn bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded transition-all"
                >
                  {buttonLoading ? (
                    <Icon
                      icon="line-md:loading-alt-loop"
                      color="#eee"
                      width="27"
                      height="27"
                    />
                  ) : (
                    "Delete Song"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </LoggedInContainer>
  );
};

export default SongFormPage;
