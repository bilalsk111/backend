import React, { useState, useRef } from "react";
import { usePost } from "../hook/usePost";
import { Image, Film, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../style/createPost.scss";
import { useAuth } from "../../auth/hooks/useAuth";

const CreatePost = () => {
  const { handleCreatePost, loading } = usePost();
  const {user} = useAuth()
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!file) return;

    await handleCreatePost(file, caption); // ✅ wait
    navigate("/feed");
  };

  return (
    <div className="create-post-container">
      <div className="create-card">
        <div className="card-header">
          {preview && (
            <button className="back-btn" onClick={() => setPreview("")}>
              <X size={24} />
            </button>
          )}
          <h3>Create new post</h3>
          <button
            className="share-btn"
            onClick={submitHandler}
            disabled={loading || !file}
          >
            {loading ? "Posting..." : "Share"}
          </button>
        </div>

        <div className="card-body">
          {!preview ? (
            <div
              className="upload-placeholder"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="icon-stack">
                <Image size={48} strokeWidth={1} />
                <Film size={48} strokeWidth={1} />
              </div>
              <p>Select photos and videos here</p>
              <button className="select-btn">Select from computer</button>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="editor-view">
              <div className="media-preview">
                {file?.type.startsWith("video") ? (
                  <video src={preview} controls />
                ) : (
                  <img src={preview} alt="preview" />
                )}
              </div>

              <div className="caption-side">
                <div className="user-info">
                  <img
                    src={user?.profileImage}
                    alt=""
                    className="avatar"
                  />
                  <span className="username">
                    {user?.username}
                  </span>
                </div>

                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={2200}
                />

                <div className="caption-footer">
                  <span>{caption.length}/2,200</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;