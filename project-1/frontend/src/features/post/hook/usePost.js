import { useContext, useRef } from "react";
import { PostContext } from "../post.context";
import { AuthContext } from "../../auth/auth.context";
import {
  createPost,
  deletePost,
  GetFeed,
  toggleLike,
  toggleSavePost,
} from "../services/post.api";

export const usePost = () => {
  const { loading, setLoading, feed, setFeed } = useContext(PostContext);
  const { user } = useContext(AuthContext);

  const isFetching = useRef(false);

  // ===============================
  // GET FEED (WITH CACHE GUARD)
  // ===============================
  const handleGetFeed = async (force = false) => {
    if (!force && feed.length > 0) return; // prevent re-fetch
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setLoading(true);

      const data = await GetFeed();

      setFeed(data?.posts || []);
    } catch (err) {
      console.error("Feed error:", err);
      setFeed([]);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // ===============================
  // TOGGLE LIKE (OPTIMISTIC)
  // ===============================
  const handleToggleLike = async (postId) => {
    const previousFeed = [...feed];

    setFeed((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              totalLikes: post.isLiked
                ? post.totalLikes - 1
                : post.totalLikes + 1,
            }
          : post
      )
    );

    try {
      await toggleLike(postId);
    } catch (err) {
      console.error(err);
      setFeed(previousFeed);
    }
  };

  // ===============================
  // CREATE POST
  // ===============================
  const handleCreatePost = async (file, caption) => {
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("media", file);
    formData.append("caption", caption);

    try {
      setLoading(true);

      const data = await createPost(formData);

      if (!data?.newPost) return;

      const newPost = {
        ...data.newPost,
        user: {
          _id: user._id,
          username: user.username,
          profileImage: user.profileImage,
        },
        totalLikes: 0,
        isLiked: false,
        isSaved: false,
      };

      setFeed((prev) => [newPost, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // DELETE POST (OPTIMISTIC)
  // ===============================
  const handleDeletePost = async (postId) => {
    const previousFeed = [...feed];

    setFeed((prev) => prev.filter((post) => post._id !== postId));

    try {
      await deletePost(postId);
    } catch (err) {
      setFeed(previousFeed);

      if (err.response?.status === 403) {
        alert("You can't delete other users' posts");
      }
    }
  };

  // ===============================
  // TOGGLE SAVE
  // ===============================
  const handleToggleSave = async (postId) => {
    const previousFeed = [...feed];

    setFeed((prev) =>
      prev.map((post) =>
        post._id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );

    try {
      await toggleSavePost(postId);
    } catch (err) {
      console.error(err);
      setFeed(previousFeed);
    }
  };

  return {
    user,
    loading,
    feed,
    handleGetFeed,
    handleToggleLike,
    handleCreatePost,
    handleDeletePost,
    handleToggleSave,
  };
};