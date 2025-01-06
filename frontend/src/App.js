import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginComponent from "./routes/Login";
import SignupComponent from "./routes/Signup";
import UploadSong from "./routes/UploadSong";
import MyMusic from "./routes/MyMusic";
import SearchPage from "./routes/SearchPage";
import MusicFooter from "./components/MusicFooter";
import SongDetails from "./routes/SongDetails";
import Userprofile from "./routes/UserProfile";
import EditPage from "./routes/EditPage";
import EditSongPage from "./components/EditSong";
import LikedSongs from "./routes/LikedSongs";
import { ToastContainer } from "react-toastify";
import { AudioProvider } from "./contexts/AudioContext";
import {  useAuth } from "./contexts/AuthContext";
import Home from "./routes/Home";

function App() {
  const { cookies } = useAuth();

  return (
    <div className="w-screen h-screen font-poppins">
      <BrowserRouter>

        {cookies.authToken ? (
          // logged in routes
          <AudioProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/uploadSong" element={<UploadSong />} />
              <Route path="/myMusic" element={<MyMusic />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<Userprofile />} />
              <Route path="/music" element={<MusicFooter />} />
              <Route path="/playedsong" element={<SongDetails />} />
              <Route path="/edit" element={<EditPage />} />
              <Route path="/edit/:songId" element={<EditSongPage />} />
              <Route path="/profileedit/:userId" element={<EditSongPage />} />
              <Route path="/likedsong" element={<LikedSongs />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AudioProvider>
        ) : (
          // logged out routes
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignupComponent />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}

        <ToastContainer autoClose={3000} />
      </BrowserRouter>
    </div>
  );
}

export default App;
