import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostForm from "./pages/PostForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create-post" element={<PostForm />} />
      </Routes>
    </Router>
  )
}

export default App

