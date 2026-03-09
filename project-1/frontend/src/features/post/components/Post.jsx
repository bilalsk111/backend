import React, { useState, useEffect, useRef } from "react";
import { usePost } from "../hook/usePost";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";

const Post = ({ user, post, currentUser }) => {
  const { handleToggleLike, handleToggleSave, handleDeletePost } = usePost();

  const [showHeart, setShowHeart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const menuRef = useRef(null);

  const isVideo = post?.mediaType === "video";

  const isOwner =
    currentUser?._id &&
    post?.user?._id &&
    String(currentUser._id) === String(post.user._id);

  // ❤️ DOUBLE TAP LIKE
  const handleDoubleTap = () => {
    if (!post?.isLiked) handleToggleLike(post?._id);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  // 🗑 DELETE CONFIRM
  const confirmDeletePost = async () => {
    await handleDeletePost(post?._id);
    setDeleteOpen(false);
  };

  // ❌ CLOSE MENU OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="post">
        {/* HEADER */}
        <div className="post-header">
          <div className="user">
            <div className="img-wrapper">
              <img
                src={user?.profileImage || "/default-avatar.png"}
                alt="profile"
              />
            </div>

            <Link to={`/profile/${user?.username}`} className="username">
              {user?.username || "anonymous"}
            </Link>
          </div>

          {/* MENU */}
          <div className="menu-wrapper" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="menu-btn"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="menu-dropdown">
                {isOwner ? (
                  <button
                    className="danger-option"
                    onClick={() => {
                      setDeleteOpen(true);
                      setMenuOpen(false);
                    }}
                  >
                    Delete
                  </button>
                ) : (
                  <button>Follow</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MEDIA */}
        <div
          className="media-container"
          onDoubleClick={handleDoubleTap}
        >
          {isVideo ? (
            <video
              src={post?.mediaUrl}
              className="post-media"
              loop
              autoPlay
              muted
              playsInline
            />
          ) : (
            <img
              src={post?.mediaUrl}
              alt="post"
              className="post-media"
            />
          )}

          {showHeart && (
            <div className="heart-overlay">
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          )}
        </div>

        {/* INTERACTIONS */}
        <div className="interaction-area">
          <div className="icons">
            <div className="left">
              <button onClick={() => handleToggleLike(post?._id)}>
                <svg
                  className={post?.isLiked ? "like filled" : ""}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              <button>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </button>

              <button className="share-btn">
                <Send size={22} />
              </button>
            </div>

            <button
              className="save-btn"
              onClick={() => handleToggleSave(post?._id)}
            >
              <svg
                className={post?.isSaved ? "saved" : ""}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>

          <div className="likes-count">
            {(Number(post?.totalLikes) || 0).toLocaleString()} likes
          </div>

          <div className="caption-section">
            <p>
              <span className="username">{user?.username}</span>{" "}
              {post?.caption}
            </p>
          </div>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete Post?"
        message="This post will be permanently removed."
        confirmText="Delete"
        danger={true}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={confirmDeletePost}
      />
    </>
  );
};

export default Post;