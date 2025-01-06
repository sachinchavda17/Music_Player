import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { getDataApi } from "../utils/serverHelpers";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SingleSongCard = ({ info, songList }) => {
  const [liked, setLiked] = useState(null);
  const [isLikedPopover, setIsLikedPopover] = useState(false);
  const { isAuthenticated, user, cookies } = useAuth();
  const token = cookies?.authToken;
  const userId = user?._id;
  const songId = info?._id;
  const { play, setPlaylist } = useAudio() || {};
  const navigate = useNavigate()

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

  useEffect(() => {
    fetchLikedStatus();
  }, [userId, songId]); // Only fetch liked status when userId or songId changes

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

  const handleClick = () => {
    if (isAuthenticated) {
      setPlaylist(songList);
      play(info);
    }else{
      navigate("/login")
    }
  };

  return (
    <div className="flex hover:bg-lightGray hover:bg-opacity-20 p-2 rounded border-lightGray">
      <div
        onClick={handleClick}
        className="w-12 h-12 bg-cover bg-cente cursor-pointer"
        style={{ backgroundImage: `url("${info.thumbnail}")` }}
      ></div>
      <div className="flex w-full" >
        <div className="text-white flex justify-center flex-col pl-4 w-5/6 cursor-pointer" onClick={handleClick}>
          <div>
            <span className="cursor-pointer hover:underline">{info.name}</span>
          </div>
          <div>
            <span className="text-xs text-lightGray cursor-pointer hover:underline">
              {info.artist.firstName + " " + info.artist.lastName}
            </span>
          </div>
        </div>

        <div className="w-1/6 flex items-center justify-center text-lightGray text-sm">
          <div className="relative">
            <Icon
              onMouseEnter={() => setIsLikedPopover(true)}
              onMouseLeave={() => setIsLikedPopover(false)}
              icon={liked ? "ph:heart-fill" : "ph:heart-bold"}
              fontSize={25}
              className={`cursor-pointer ${
                liked ? "text-primary" : "text-lightGray hover:text-white"
              }`}
              onClick={likeToggleFetch}
            />
            {isLikedPopover && (
              <div className="absolute z-10 bottom-0 right-0 mb-4 mr-6 text-sm transition-opacity duration-300 border rounded-lg shadow-sm opacity-100 text-lightGray border-darkGray-light bg-darkGray">
                <div className="px-3 py-2 border-b rounded-t-lg border-darkGray-light bg-darkGray-light">
                  <h3 className="font-semibold text-lightGray-light">
                    {liked ? "Like" : "Dislike"}
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleSongCard;
