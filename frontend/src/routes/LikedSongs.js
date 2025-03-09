import SingleSongCard from "../components/SingleSongCard";
import LoggedInContainer from "../containers/LoggedInContainer";
import Loading from "../components/Loading";
import { useSongApi } from "../contexts/SongApiContext";

const LikedSongs = () => {
  const { loading, likedSongs } = useSongApi() || {};

  return (
    <LoggedInContainer curActiveScreen="likedsong">
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="text-white text-2xl font-semibold pb-4 pl-2 sm:pt-5">
            Your Liked Song
          </div>
          {likedSongs?.length === 0 ? (
            <div className="text-lightGray text-lg pl-2">
              You haven't liked any song till now.
            </div>
          ) : (
            <div className="space-y-3 overflow-auto">
              {likedSongs?.map((item) => (
                <SingleSongCard
                  info={item}
                  songList={likedSongs} 
                  key={item._id}
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
