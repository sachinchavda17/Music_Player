import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const AudioContext = createContext();

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);

  const audioRef = useRef(new Audio());
  // const currentSong = playlist[currentIndex] || {};
  const currentSong =
    currentIndex >= 0 && currentIndex < playlist.length
      ? playlist[currentIndex]
      : null;

  const play = (song = null) => {
    if (song?.track && typeof song.track === "string") {
      // If the song is not in the playlist, add it
      if (!playlist.some((s) => s._id === song._id)) {
        setPlaylist((prevPlaylist) => {
          const newPlaylist = [...prevPlaylist, song];
          setCurrentIndex(newPlaylist.length - 1); // Set the index to the new song
          return newPlaylist;
        });
      } else {
        // If the song is already in the playlist, just update the current index
        setCurrentIndex(playlist.findIndex((s) => s._id === song._id));
      }
      audioRef.current.src = song.track;
    }

    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const nextTrack = () => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentIndex(randomIndex);
      play(playlist[randomIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % playlist.length;
      setCurrentIndex(nextIndex);
      play(playlist[nextIndex]);
    }
  };

  // Move to the previous song
  const prevTrack = () => {
    const prevIndex =
      currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    play(playlist[prevIndex]);
  };

  // Toggle shuffle mode
  const toggleShuffle = () => {
    setShuffle((prev) => !prev);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (playlist.length > 0 && currentIndex !== null) {
        play(playlist[currentIndex].track); // Plays the song at the current index
      }
    }
  };

  // Set volume
  const setAudioVolume = (newVolume) => {
    const clampedVolume = Math.min(1, Math.max(0, newVolume)); // Ensure volume stays between 0 and 1
    audioRef.current.volume = clampedVolume;
    setVolume(clampedVolume);
  };

  // Seek to a specific time
  const seekTo = (time) => {
    const clampedTime = Math.min(duration, Math.max(0, time)); // Ensure time stays within track duration
    audioRef.current.currentTime = clampedTime;
    setProgress(clampedTime);
  };

  // Function to stop music when user logs out
  const stopMusicLogout = () => {
    pause(); // Pauses the music
    setPlaylist([]); // Optionally, you can clear the playlist
    setCurrentIndex(0); // Reset current index if needed
  };

  // Track progress and duration, handle song end
  useEffect(() => {
    const updateProgress = () => {
      setProgress(audioRef.current.currentTime);
    };

    const updateDuration = () => {
      setDuration(audioRef.current.duration || 0);
    };

    const handleEnd = () => {
      nextTrack(); // Automatically move to next track when the current one ends
    };

    audioRef.current.addEventListener("timeupdate", updateProgress);
    audioRef.current.addEventListener("loadedmetadata", updateDuration);
    audioRef.current.addEventListener("ended", handleEnd);

    return () => {
      audioRef.current.removeEventListener("timeupdate", updateProgress);
      audioRef.current.removeEventListener("loadedmetadata", updateDuration);
      audioRef.current.removeEventListener("ended", handleEnd);
    };
  }, [currentIndex, playlist, shuffle]);

  return (
    <AudioContext.Provider
      value={{
        playlist,
        currentIndex,
        isPlaying,
        volume,
        shuffle,
        progress,
        duration,
        currentSong,
        play,
        pause,
        nextTrack,
        prevTrack,
        setPlaylist,
        toggleShuffle,
        togglePlayPause,
        setAudioVolume,
        seekTo,
        stopMusicLogout
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
