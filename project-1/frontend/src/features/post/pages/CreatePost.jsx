import React, { useState, useRef } from "react";
import { usePost } from "../hook/usePost";
import { Image, Film, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../style/createPost.scss";
import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";

const CreatePost = () => {
  const { handleCreatePost, loading } = usePost();
  const { user } = useAuth();
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
    await handleCreatePost(file, caption);
    navigate("/feed");
  };

  return (
    <div className="create-post-container">
      {/* Top Progress Bar */}
    <Sidebar />

      {loading && (
        <div className="global-progress-bar">
          <div className="fill" style={{ width: "70%" }}></div>
        </div>
      )}

      {/* Global Close - Outside Card */}
      <button className="global-close" onClick={() => navigate(-1)}>
        <X size={32} color="#fff" />
      </button>

      <div className={`create-card ${preview ? "expanded" : ""}`}>
        <div className="card-header">
          <div className="header-left">
            {preview && !loading && (
              <button className="action-btn" onClick={() => setPreview("")}>
                <ArrowLeft size={24} />
              </button>
            )}
          </div>
          <h3>Create new post</h3>
          <div className="header-right">
            {preview && (
              <button
                className="share-btn"
                onClick={submitHandler}
                disabled={loading || !file}
              >
                {loading ? "Posting..." : "Share"}
              </button>
            )}
          </div>
        </div>

        <div className="card-body">
          {!preview ? (
            <div
              className="upload-placeholder"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="icon-stack">
                <Image size={64} strokeWidth={1} className="main-icon" />
                <Film size={32} strokeWidth={1} className="sub-icon" />
              </div>
              <h2>Drag photos and videos here</h2>
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
                  <video src={preview} controls autoPlay muted loop />
                ) : (
                  <img src={preview} alt="preview" />
                )}
              </div>

              <div className="caption-side">
                <div className="user-info">
                  <img
                    src={user?.profileImage || "https://via.placeholder.com/150"}
                    alt="avatar"
                    className="avatar"
                  />
                  <span className="username">{user?.username}</span>
                </div>

                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={2200}
                />

                <div className="caption-footer">
                  <div className="emoji-trigger">
                    <svg aria-label="Emoji" color="#8e8e8e" fill="#8e8e8e" height="20" role="img" viewBox="0 0 24 24" width="20"><path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 0a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm3.17 6.166a5.597 5.597 0 01-4.811-2.77a1.012 1.012 0 011.745-1.02a3.574 3.574 0 006.132 0 1.012 1.012 0 011.745 1.02 5.601 5.601 0 01-4.811 2.77zM12.001.5a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012.001.5zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path></svg>
                  </div>
                  <span className="char-count">{caption.length.toLocaleString()}/2,200</span>
                </div>
                
                <div className="accessibility-row">
                    <span>Add location</span>
                    <svg color="#fff" fill="#fff" height="16" role="img" viewBox="0 0 24 24" width="16"><path d="M12.053 8.105a1.604 1.604 0 101.603 1.604 1.604 1.604 0 00-1.603-1.604z"></path><path d="M12 0C7.14 0 3.209 3.931 3.209 8.792c0 1.954.646 3.824 1.868 5.409l6.19 8.017a1.002 1.002 0 001.466 0l6.19-8.017a8.73 8.73 0 001.868-5.409C20.791 3.931 16.86 0 12 0zm5.12 13.064L12 19.698l-5.12-6.634a6.726 6.726 0 01-1.439-4.272c0-3.727 3.033-6.76 6.76-6.76s6.76 3.033 6.76 6.76a6.726 6.726 0 01-1.439 4.272z"></path></svg>
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