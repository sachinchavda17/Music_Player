import { useState } from "react";
import { Icon } from "@iconify/react";
import TextInput from "../components/TextInput";
import { fileUploadHandler } from "../utils/serverHelpers";
import { useNavigate } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const UploadSong = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [thumbnail, setThumbnail] = useState(null);
  const [track, setTrack] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { cookies } = useAuth();
  const token = cookies?.authToken;
  const navigate = useNavigate();

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const submitSong = async (songData) => {
    try {
      setButtonLoading(true);
      const formData = new FormData();
      formData.append("name", songData.name);

      if (track) {
        formData.append("track", track);
      }

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const response = await fileUploadHandler("/song/create-new", "post", formData, token);
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
          <div className="text-2xl font-semibold mb-5 text-lightGray-light mt-8">
            Upload Your Music
          </div>

          <div className="w-full lg:w-2/3 flex space-x-3">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="Song Name"
                labelClassName="text-white"
                placeholder="Enter song name"
                register={register}
                registerName="name"
                error={errors?.name?.message}
                inputClassName="bg-darkGray-light text-white border border-primary rounded-lg shadow-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="w-full lg:w-2/3 flex flex-col lg:flex-row lg:space-x-3 py-5">
            <div className="flex flex-col">
              <label htmlFor="thumbnail" className="text-white font-medium mb-2">
                Select Thumbnail
              </label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setThumbnail)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-lightGray-light hover:file:bg-primary-light"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="track" className="text-white font-medium mb-2">
                Select Track
              </label>
              <input
                type="file"
                id="track"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, setTrack)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-lightGray-light hover:file:bg-primary-light"
              />
            </div>
          </div>

          <button
            disabled={buttonLoading}
            className={`flex items-center justify-center p-4 rounded-full font-semibold w-48 cursor-pointer transition-all transform bg-gradient-to-r from-gray-600 to-gray-700 text-lightGray-light ${
              buttonLoading
                ? " opacity-70"
                : "hover:scale-105 hover:shadow-lg"
            }`}
            type="submit"
          >
            {buttonLoading ? (
              <div className="animate-spin">
                <Icon icon="line-md:loading-alt-loop" color="#fff" width="24" height="24" />
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
