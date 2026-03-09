import React, { memo } from "react";

const ProfileStats = ({
  postsCount = 0,
  followersCount = 0,
  followingCount = 0,
}) => {
  return (
    <div className="profile-stats">
      <span><strong>{postsCount}</strong> posts</span>
      <span><strong>{followersCount}</strong> followers</span>
      <span><strong>{followingCount}</strong> following</span>
    </div>
  );
};

export default memo(ProfileStats);