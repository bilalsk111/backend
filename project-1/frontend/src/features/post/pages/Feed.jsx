import React, { useEffect } from "react";
import "../style/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hook/usePost";
import { useAuth } from "../../auth/hooks/useAuth"; // ✅ ADD THIS

const Feed = () => {
  const { feed, handleGetFeed, loading } = usePost();
  const { user } = useAuth();

  useEffect(() => {
    handleGetFeed();
  }, []);

  if (loading) {
    return (
      <main>
        <h1>Feed is loading...</h1>
      </main>
    );
  }

  return (
    <main className="feed-page">
      <div className="feed">
        <div className="posts">
          {feed.length === 0 && <h2>No posts yet</h2>}

          {feed.map((post) => (
            <Post
              key={post._id}
              user={post.user}
              post={post}
              currentUser={user}  
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Feed;