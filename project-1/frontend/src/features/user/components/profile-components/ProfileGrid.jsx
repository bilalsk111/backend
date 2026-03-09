import React from "react";

const ProfileGrid = ({ posts }) => {
  if (!posts.length) {
    return (
      <div className="no-posts">
        <h3>No Posts Yet</h3>
      </div>
    );
  }

  return (
    <div className="profile-grid">
      {posts.map((post) => (
        <div key={post._id} className="grid-item">
          {post.mediaType === "video" ? (
            <video src={post.mediaUrl} />
          ) : (
            <img src={post.mediaUrl} alt="" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProfileGrid;