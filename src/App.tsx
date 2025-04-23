import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/posts" element={<div>post list</div>} />
      <Route path="/posts/:id" element={<div>post detail</div>} />
      <Route path="/posts/new" element={<div>post new</div>} />
      <Route path="/posts/edit/:id" element={<div>post edit</div>} />
      <Route path="/profile" element={<div>profile</div>} />
      <Route path="/profile/edit" element={<div>profile edit</div>} />
      <Route path="/notification" element={<div>notification</div>} />
      <Route path="/search" element={<div>search</div>} />
      <Route path="/login" element={<div>login</div>} />
      <Route path="/signup" element={<div>signup</div>} />
      <Route path="*" element={<Navigate replace to="/"/>} />
    </Routes>
  );
}

export default App;
