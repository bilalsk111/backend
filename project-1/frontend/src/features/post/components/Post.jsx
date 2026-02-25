import React, { useState } from 'react';
import { usePost } from '../hook/usePost';

const Post = ({ user, post }) => {
    const { handleToggleLike } = usePost();
    const [showHeart, setShowHeart] = useState(false);
    const isVideo = post.mediaType === "video";

    const handleDoubleTap = () => {
        if (!post.isLiked) handleToggleLike(post._id);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
    };

    return (
        <div className="post">
            <div className="post-header">
                <div className="user">
                    <div className="img-wrapper">
                        <img src={user?.profileImage} alt="" />
                    </div>
                    <p className="username">{user?.username}</p>
                </div>
                <button className="more-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <circle cx="12" cy="12" r="1.5" /><circle cx="6" cy="12" r="1.5" /><circle cx="18" cy="12" r="1.5" />
                    </svg>
                </button>
            </div>

            <div className="media-container" onDoubleClick={handleDoubleTap}>
                {isVideo ? (
                    <video src={post.mediaUrl} className="post-media" loop autoPlay muted playsInline />
                ) : (
                    <img src={post.mediaUrl} alt="" className="post-media" />
                )}
                {showHeart && (
                    <div className="heart-overlay">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    </div>
                )}
            </div>

            <div className="interaction-area">
                <div className="icons">
                    <div className="left">
                        <button onClick={() => handleToggleLike(post._id)}>
                            <svg className={post.isLiked ? "like filled" : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </button>
                        <button>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                        </button>
                        <button>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                        </button>
                    </div>
                    <button>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                    </button>
                </div>

                <div className="likes-count">
                    {post.totalLikes?.toLocaleString()} likes
                </div>

                <div className="caption-section">
                    <p>
                        <span className="username">{user?.username}</span>
                        {post.caption}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Post;