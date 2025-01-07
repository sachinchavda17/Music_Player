import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import SingleSongBox from "../components/SingleSongBox";
import { getDataApi } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";

const EditPage = () => {
  const [songData, setSongData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentSong } = useAudio();
  const {cookies}  = useAuth()
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
  }, []);

  return (
    <LoggedInContainer curActiveScreen="edit">
      {loading ? (
        <Loading />
      ) : (
        <div className={`bg-app-black`}>
          <div className="text-white text-2xl font-semibold pb-4 pl-2 sm:pt-5">
            Edit Your Songs
          </div>
          <div className="grid gap-2 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 overflow-auto max-lg:grid-cols-3 max-md:grid-cols-2">
            {songData.map((item) => (
              <SingleSongBox item={item} edit={1} key={JSON.stringify(item)} />
            ))}
          </div>
        </div>
      )}
    </LoggedInContainer>
  );
};

export default EditPage;
