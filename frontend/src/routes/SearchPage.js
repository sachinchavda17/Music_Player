import { useState } from "react";
import LoggedInContainer from "../containers/LoggedInContainer";
import { Icon } from "@iconify/react";
import { getDataApi } from "../utils/serverHelpers";
import SingleSongCard from "../components/SingleSongCard";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";

const SearchPage = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [songData, setSongData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentSong } = useAudio() || {};

  const { cookies } = useAuth();
  const token = cookies?.authToken;

  const searchSong = async (searchText) => {
    try {
      if (!searchText) return;
      setLoading(true);
      const response = await getDataApi(
        "/song/get/search/" + searchText,
        token
      );
      setSongData(response.data);
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoggedInContainer curActiveScreen="search">
      <div className={`${currentSong ? " mb-20 " : ""} w-full py-5`}>
        <div className={`  text-white text-2xl font-semibold pb-4 pl-2 `}>
          Search Song : <span className="font-bold"> {searchText}</span>
        </div>
        <div
          className={`w-full md:w-1/3  py-2 text-sm rounded-full bg-darkGray px-5 flex text-white space-x-3 gap-2 items-center ${
            isInputFocused ? "border border-white transition" : ""
          }`}
        >
          <Icon icon="ic:outline-search" fontSize={30} className="text-2xl" />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            style={{ all: "unset", width: "100%" }}
            className=" text-sm bg-darkGray "
            onFocus={() => {
              setIsInputFocused(true);
            }}
            onBlur={() => {
              setIsInputFocused(false);
            }}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              searchSong(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchSong(searchText);
              }
            }}
          />
        </div>
        {loading ? (
          <Loading />
        ) : songData.length > 0 ? (
          <div className="pt-3 space-y-3 h-full">
            <div className="text-white">
              Showing search results for
              <span className="font-bold"> {searchText}</span>
            </div>
            {songData.map((item, ind) => (
              <SingleSongCard info={item} songList={songData} key={ind} />
            ))}
          </div>
        ) : (
          <div className="text-lightGray pt-3 h-full">
            Nothing to show here.
          </div>
        )}
      </div>
    </LoggedInContainer>
  );
};

export default SearchPage;
