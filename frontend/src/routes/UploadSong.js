import { useState } from "react";
import { Icon } from "@iconify/react";
import CloudinaryUpload from "../components/CloudinaryUpload";
import TextInput from "../components/TextInput";
import {  postDataApi } from "../utils/serverHelpers";
import { useNavigate } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const UploadSong = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailName, setThumbnailName] = useState();
  const [buttonLoading, setButtonLoading] = useState(null);
  const [uploadedSongFileName, setUploadedSongFileName] = useState();
  const { cookies } = useAuth();
  const token = cookies?.authToken;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitSong = async (songData) => {
    try {
      setButtonLoading(true);
      const data = {
        name: songData.name,
        thumbnail: thumbnail,
        track: playlistUrl,
      };
      const response = await postDataApi("/song/create", data,token);
      if (response.err) {
        toast.error(response.err || "Error while creating song");
      } else {
        toast.success("Song Created");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <LoggedInContainer>
      <div className="h-full w-full">
        <form onSubmit={handleSubmit((data) => submitSong(data))}>
          <div className="text-2xl  font-semibold mb-5 text-lightGray-light mt-8">
            Upload Your Music
          </div>
          <div className=" w-full lg:w-2/3 flex space-x-3">
            <div className=" w-full lg:w-1/2">
              <TextInput
                label="Song Name"
                labelClassName={"text-white"}
                placeholder="Enter song name"
                register={register}
                registerName={"name"}
                error={errors?.name?.message}
              />
            </div>
          </div>
          <div className="w-full lg:w-2/3 flex flex-col lg:flex-row lg:space-x-3">
            <div className=" pt-5">
              {thumbnailName ? (
                <div className="bg-primary text-lightGray-light rounded-full p-3  ">
                  {thumbnailName.substring(0, 50)}...
                </div>
              ) : (
                <CloudinaryUpload
                  setUrl={setThumbnail}
                  setName={setThumbnailName}
                  displayName={"Select Thumbnail"}
                />
              )}
            </div>
            <div className="py-5">
              {uploadedSongFileName ? (
                <div className="bg-primary text-lightGray-light rounded-full p-3 ">
                  {uploadedSongFileName.substring(0, 35)}...
                </div>
              ) : (
                <CloudinaryUpload
                  setUrl={setPlaylistUrl}
                  setName={setUploadedSongFileName}
                  displayName={"Select Track"}
                />
              )}
            </div>
          </div>

          <button
            disabled={buttonLoading}
            className="bg-primary hover:bg-primary-light text-lightGray-light w-40 flex items-center justify-center p-4 rounded-full cursor-pointer font-semibold transition-shadow transform hover:scale-105 transition-transform"
            type="submit"
          >
            {buttonLoading ? (
              <div className="px-3 py-0">
                <Icon
                  icon="line-md:loading-alt-loop"
                  color="#eee"
                  width="27"
                  height="27"
                />
              </div>
            ) : (
              "Submit Song"
            )}
          </button>
        </form>
      </div>
    </LoggedInContainer>
  );
};

export default UploadSong;
