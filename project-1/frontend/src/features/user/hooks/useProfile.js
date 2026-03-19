import { useEffect, useState, useRef } from "react";
import { getProfile } from "../services/user.api";

const profileCache = {};

export const useProfile = (username) => {
  const [profileState, setProfileState] = useState({
    profileUser: null,
    posts: [],
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
  });

  const [loading, setLoading] = useState(true);
  const fetching = useRef(false);

  useEffect(() => {
    if (!username) return;
    if (profileCache[username]) {
      setProfileState(profileCache[username]);
      setLoading(false);
      return;
    }

    if (fetching.current) return;

    const fetchProfile = async () => {
      try {
        fetching.current = true;
        setLoading(true);

        const data = await getProfile(username);

        const profileData = {
          profileUser: data.user,
          posts: data.posts || [],
          followersCount: data.followersCount || 0,
          followingCount: data.followingCount || 0,
          isFollowing: data.isFollowing || false,
        };

        profileCache[username] = profileData;

        setProfileState(profileData);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
        fetching.current = false;
      }
    };

    fetchProfile();
  }, [username]);

  return {
    ...profileState,
    setProfileState,
    loading,
  };
};