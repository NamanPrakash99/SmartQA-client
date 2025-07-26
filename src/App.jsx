import { Route, Routes } from "react-router-dom";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import OAuthSuccess from "./pages/OAuthSuccess";
import MainPage from "./pages/MainPage";
import Home from "./pages/Home";
import AuthLoader from "./AuthLoader";

function App() {
  return (
    <>
      <AuthLoader />
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateRoom /></ProtectedRoute>} />
        <Route path="/join" element={<ProtectedRoute><JoinRoom /></ProtectedRoute>} />
        <Route path="/room/:code" element={<ProtectedRoute><Room /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
      </Routes>
    </>
  )
}

export default App;
