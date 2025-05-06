import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/home";
import PostListPage from "../pages/Posts";
import PostDetailPage from "../pages/Posts/detail";
import PostNewPage from "../pages/Posts/new";
import PostEditPage from "../pages/Posts/edit";
import ProfilePage from "../pages/profile";
import ProfileEditPage from "../pages/profile/edit";
import NotificationPage from "../pages/notification";
import SearchPage from "../pages/search";
import LoginPage from "../pages/users/login";
import SignupPage from "../pages/users/signup";

interface RouterProps {
  isAuthenticated: boolean;
}

export default function Router({ isAuthenticated }: RouterProps) {
  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/posts/new" element={<PostNewPage />} />
          <Route path="/posts/edit/:id" element={<PostEditPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </>
      )}
    </Routes>
  );
}
