import { useState } from "react";
import { followUser, unfollowUser } from "../services/user.api";

export const useFollow = () => {
  const [loading, setLoading] = useState(false);

  const handleFollow = async (username) => {
    try {
      setLoading(true);
      await followUser(username);
      return true;
    } catch (err) {
      console.error(err.response?.data || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (username) => {
    try {
      setLoading(true);
      await unfollowUser(username);
      return true;
    } catch (err) {
      console.error(err.response?.data || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleFollow, handleUnfollow };
};