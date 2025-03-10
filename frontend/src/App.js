import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginComponent from "./routes/Login";
import SignupComponent from "./routes/Signup";
import MyMusic from "./routes/MyMusic";
import SearchPage from "./routes/SearchPage";
import SongDetails from "./routes/SongDetails";
import Userprofile from "./routes/UserProfile";
import EditPage from "./routes/EditPage";
import EditUploadSong from "./routes/EditUploadSong";
import LikedSongs from "./routes/LikedSongs";
import { ToastContainer } from "react-toastify";
import { AudioProvider } from "./contexts/AudioContext";
import { useAuth } from "./contexts/AuthContext";
import Home from "./routes/Home";
import { SongApiProvider } from "./contexts/SongApiContext";

function App() {
  const { cookies, user } = useAuth();

  return (
    <div className="font-poppins">
      <BrowserRouter>
        {cookies.authToken ? (
          // logged in routes
          <SongApiProvider>
            <AudioProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<Userprofile />} />
                <Route path="/playedsong" element={<SongDetails />} />
                <Route path="/likedsong" element={<LikedSongs />} />
                <Route path="/uploadSong" element={<EditUploadSong />} />
                {user?.isArtist && (
                  <>
                    <Route path="/myMusic" element={<MyMusic />} />
                    <Route path="/edit" element={<EditPage />} />
                    <Route path="/edit/:songId" element={<EditUploadSong />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </>
                )}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AudioProvider>
          </SongApiProvider>
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
