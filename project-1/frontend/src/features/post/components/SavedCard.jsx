import React from 'react';
import { Play, BookmarkX } from 'lucide-react';
import { usePost } from "../hook/usePost";

const SavedCard = ({ post, setPosts }) => {
  const { handleToggleSave } = usePost();
  const isVideo = post?.mediaType === "video";

  const onUnsave = async (e) => {
    e.stopPropagation();
    setPosts((prev) => prev.filter((p) => p._id !== post._id));
    try {
      await handleToggleSave(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="saved-card">
      <div className="thumbnail-wrapper">
        {isVideo ? <video src={post?.mediaUrl} muted /> : <img src={post?.mediaUrl} alt="" />}
        <div className="overlay">
          <div className="overlay-content">
             <button className="unsave-btn" onClick={onUnsave}>
                <BookmarkX size={20} fill="white" color="white" />
                <span>Unsave</span>
             </button>
          </div>
        </div>
        {isVideo && <Play className="type-icon" size={20} fill="white" color="white" />}
      </div>
    </div>
  );
};

export default SavedCard;