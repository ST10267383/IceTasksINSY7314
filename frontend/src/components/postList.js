import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "https://localhost:3001"; // adjust if your port/path differs

function Row({ post, onDelete }) {
  return (
    <tr>
      <td>{post.user}</td>
      <td>{post.content}</td>
      <td>
        {post.image ? (
          <img
            src={`data:image/jpeg;base64,${post.image}`}
            alt="post"
            style={{ maxWidth: 100, maxHeight: 100, objectFit: "cover" }}
          />
        ) : (
          <em>No image</em>
        )}
      </td>
      <td>
        <Link className="btn btn-sm btn-primary me-2" to={`/edit/${post._id}`}>
          Edit
        </Link>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(post._id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch posts once
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/post/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        alert("Couldn't load posts. If your backend uses HTTPS, visit https://localhost:3001 once to accept the cert, then refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // delete by id
  async function deletePost(id) {
    try {
      const token = localStorage.getItem("jwt"); // set this on login
      const res = await fetch(`${API}/post/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPosts((cur) => cur.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed. Make sure you’re logged in and have a valid token.");
    }
  }

  if (loading) return <div className="container">Loading…</div>;

  return (
    <div className="container">
      <h3 className="header">APDS notice Board</h3>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Caption</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length ? (
            posts.map((p) => <Row key={p._id} post={p} onDelete={deletePost} />)
          ) : (
            <tr>
              <td colSpan="4">
                <em>No posts yet.</em>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}