import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import PostList from "./components/postList";
import Register from "./components/register";
import Login from "./components/login";
import CreatePost from "./components/postCreate";


const EditPost   = () => <div className="container mt-3">Edit Post</div>;

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/create" element={<CreatePost />} />
        {/* <Route path="/edit/:id" element={<EditPost />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
