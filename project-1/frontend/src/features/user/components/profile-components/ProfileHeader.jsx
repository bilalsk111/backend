import React, { memo } from "react";
import ProfileStats from "./ProfileStats";

const ProfileHeader = ({
  profileUser,
  postsCount = 0,
  followersCount = 0,
  followingCount = 0,
  isOwnProfile,
  isFollowing = false,
  followLoading=false,
   onFollowClick,
}) => {
  if (!profileUser) return null;

  const { name = "—", username = "", profileImage, bio = "" } = profileUser;

  const avatarSrc = profileImage || "/default-avatar.png";
  const displayUsername = username ? `@${username}` : "";

  return (
    <header className="profile-header">
      <div className="profile-avatar-section">
        <img
          src={avatarSrc}
          alt={`${name} profile avatar`}
          className="profile-avatar"
          loading="lazy"
        />
      </div>

      <div className="profile-info-section">
        <div className="profile-top-row">
          <div className="profile-name-block">
            <h2 className="profile-name">{name}</h2>
            {displayUsername && (
              <p className="profile-username">{displayUsername}</p>
            )}
          </div>

           {isOwnProfile ? (
          <button className="edit-btn">
            Edit Profile
          </button>
        ) : (
          <button
            className={`follow-btn ${isFollowing ? "following" : ""}`}
            onClick={onFollowClick} 
            disabled={followLoading}
          >
            {followLoading
              ? "Please wait..."
              : isFollowing
              ? "Unfollow"
              : "Follow"}
          </button>
        )}
        </div>

        <ProfileStats
          postsCount={postsCount}
          followersCount={followersCount}
          followingCount={followingCount}
        />

        {bio && (
          <div className="profile-bio">
            <p>{bio}</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default memo(ProfileHeader);
