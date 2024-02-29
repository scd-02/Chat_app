import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import Layout from "./pages/Layout";

function App() {
  return (
    <div className="App">
      <Routes path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
