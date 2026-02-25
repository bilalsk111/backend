import { useContext } from "react";
import { PostContext } from "../post.context";
import { AuthContext } from "../../auth/auth.context";
import { createPost, GetFeed, toggleLike } from "../services/post.api";

export const usePost = () => {
  const postContext = useContext(PostContext);
  const authContext = useContext(AuthContext);

  const { loading, setLoading, feed, setFeed } = postContext;
  const { user } = authContext;

  const handleGetFeed = async () => {
    try {
      setLoading(true);
      const data = await GetFeed();
      setFeed(data.post);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const data = await toggleLike(postId);

      setFeed((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLiked: data.liked,
                totalLikes: data.totalLikes,
              }
            : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (file, caption) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("media", file);
    formData.append("caption", caption);

    try {
      setLoading(true);

      const data = await createPost(formData);

      if (!user) return; // safety check

      const newPostFormatted = {
        ...data.newPost,
        user: {
          _id: user._id,
          username: user.username,
          profileImage: user.profileImage,
        },
        totalLikes: 0,
        isLiked: false,
      };

      setFeed((prev) => [newPostFormatted, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    feed,
    handleGetFeed,
    handleToggleLike,
    handleCreatePost,
  };
};