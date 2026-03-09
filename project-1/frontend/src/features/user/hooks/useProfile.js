import { useEffect, useState } from "react";
import { getProfile } from "../services/user.api";

export const useProfile = (username) => {
  const [profileState, setProfileState] = useState({
    profileUser: null,
    posts: [],
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile(username);

        setProfileState({
          profileUser: data.user,
          posts: data.posts,
          followersCount: data.followersCount,
          followingCount: data.followingCount,
          isFollowing: data.isFollowing,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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