import { useContext } from "react";
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
  const { loading, setLoading, feed, setFeed } =
    useContext(PostContext);

  const { user } = useContext(AuthContext);


  const handleGetFeed = async () => {
    try {
      setLoading(true);

      const data = await GetFeed();

      // 🔥 CORRECT PROPERTY
      setFeed(data.posts || []);

    } catch (err) {
      console.error("Feed error:", err);
      setFeed([]);
    } finally {
      setLoading(false);
    }
  };

const handleToggleLike = async (postId) => {
  try {
    const res = await toggleLike(postId);

    setFeed((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              isLiked: res.liked,
              totalLikes: res.totalLikes,
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
  if (!user) {
    console.error("User not loaded");
    return;
  }

  const formData = new FormData();
  formData.append("media", file);
  formData.append("caption", caption);

  try {
    setLoading(true);

    const data = await createPost(formData);

    if (!data?.newPost) {
      console.error("Invalid post response");
      return;
    }

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

  const handleDeletePost = async (postId) => {
    const previousFeed = [...feed];

    setFeed((prev) =>
      prev.filter((post) => post._id !== postId)
    );

    try {
      await deletePost(postId);
    } catch (err) {
      setFeed(previousFeed);

      if (err.response?.status === 403) {
        alert("You can't delete other users' posts");
      }
    }
  };

 const handleToggleSave = async (postId) => {
  try {
    const res = await toggleSavePost(postId);

    setFeed((prev) =>
      prev.map((post) =>
        post._id === postId
          ? { ...post, isSaved: res.saved }
          : post
      )
    );
  } catch (err) {
    console.error(err);
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