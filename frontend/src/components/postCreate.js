import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user: "",
    content: "",
    image: "", // base64 (no data:... prefix)
  });

  // Pre-fill the user from localStorage; force login if missing
  useEffect(() => {
    const name = localStorage.getItem("name");
    if (!name) {
      navigate("/login");
      return;
    }
    setForm((f) => ({ ...f, user: name }));
  }, [navigate]);

  const updateForm = (value) => setForm((prev) => ({ ...prev, ...value }));

  // Read the chosen image and store *only* the base64 portion
  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const base64 = String(dataUrl).split(",")[1] ?? "";
      updateForm({ image: base64 });
    } catch (err) {
      console.error(err);
      window.alert("Error reading image file.");
    }
  }

  // Submit with Bearer token
  async function onSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("jwt");
    if (!token) {
      window.alert("Please log in first.");
      navigate("/login");
      return;
    }

    const payload = {
      user: form.user,
      content: form.content,
      image: form.image,
    };

    try {
      const resp = await fetch("https://localhost:3001/post/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Create failed (${resp.status}): ${text}`);
      }

      const result = await resp.json();
      console.log("Post created:", result);

      // Clear content/image (keep user) and return to list
      setForm((f) => ({ ...f, content: "", image: "" }));
      navigate("/");
    } catch (err) {
      console.error(err);
      window.alert("Error creating post. See console for details.");
    }
  }

  return (
    <div className="container mt-3">
      <h3>Create New Post</h3>
      <form onSubmit={onSubmit} className="form">
        <div className="form-group mb-3">
          <label htmlFor="user">User</label>
          <input
            id="user"
            className="form-control"
            type="text"
            value={form.user}
            disabled
            readOnly
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="content">Content</label>
          <input
            id="content"
            className="form-control"
            type="text"
            value={form.content}
            onChange={(e) => updateForm({ content: e.target.value })}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="image">Image</label>
          <input
            id="image"
            className="form-control"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <input type="submit" value="Create Post" className="btn btn-primary" />
      </form>
    </div>
  );
}