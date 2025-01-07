import { useState, useEffect } from "react";
import SingleSongCard from "../components/SingleSongCard";
import { getDataApi } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";

const LikedSongs = () => {
  const [songData, setSongData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentSong } = useAudio();
  const { cookies } = useAuth();
  const token = cookies?.authToken;

  useEffect(() => {
    const getData = async () => {
      try {
        console.log(token)
        const response = await getDataApi("/song/likesongs", token);
        if (response.data) {
          setSongData(response.data);
        } else {
          toast.error(response.err);
        }
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [token]);

  return (
    <LoggedInContainer curActiveScreen="likedsong">
      {loading ? (
        <Loading />
      ) : (
        <div className="">
          <div
            className={`  text-white text-2xl font-semibold pb-4 pl-2 sm:pt-5`}
          >
            Your Liked Song
          </div>
          {songData.length === 0 ? (
            <div className="text-lightGray text-lg pl-2">
              You haven't liked any song till now.
            </div>
          ) : (
            <div className="space-y-3 overflow-auto">
              {songData.map((item) => (
                <SingleSongCard
                  info={item}
                  songList={songData}
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

export default LikedSongs;
