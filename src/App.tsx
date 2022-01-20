import SignUp from "pages/SignUp";
import { useState } from "react";
import LogIn from "pages/LogIn";
import { User } from "firebase/auth";
import useUser from "context/userContext";
import Loading from "components/Loading";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "pages/Feed";
import Header from "components/Header";
import Upload from "pages/Upload";
import Profile from "pages/Profile";
import VideoPost from "pages/VideoPost";
import NotFound from "pages/NotFound";

const App = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <Loading />;
  }

  return user ? <Auth /> : <UnAuth />;
};

const Auth = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/:username/video/:postId" element={<VideoPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

const UnAuth = () => {
  const [isNewUser, setNewUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  return isNewUser ? (
    <SignUp user={user} />
  ) : (
    <LogIn setNewUser={setNewUser} setUser={setUser} />
  );
};

export default App;
