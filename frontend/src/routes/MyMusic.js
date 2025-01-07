import { useState, useEffect } from "react";
import SingleSongCard from "../components/SingleSongCard";
import { getDataApi } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";

const MyMusic = () => {
  const [songData, setSongData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentSong } = useAudio();
  const { cookies } = useAuth();
  const token = cookies?.authToken

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getDataApi("/song/get/mysongs", token);
        setSongData(response.data);
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [token]);

  return (
    <LoggedInContainer curActiveScreen="myMusic">
      {loading ? (
        <Loading />
      ) : (
        <div className={""}>
          <div
            className={`text-white text-2xl font-semibold pb-4 pl-2 sm:pt-5`}
          >
            My Songs
          </div>
          {songData.length === 0 ? (
            <div className="text-lightGray text-lg pl-2">
              You haven't upload song.
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

export default MyMusic;
