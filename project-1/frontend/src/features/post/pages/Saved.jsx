import React, { useEffect, useState } from "react";
import SavedCard from "../components/SavedCard";
import { getSavedPosts } from "../services/post.api";
import { ArrowLeft, Bookmark } from "lucide-react";
import "../style/saved.scss";
import { useNavigate } from "react-router-dom";

const Saved = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const data = await getSavedPosts();
        setPosts(Array.isArray(data) ? data : data.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  return (
    <div className="saved-page-container">
      <span onClick={() => navigate(-1)} className="back-btn"><ArrowLeft  /></span>
      <header className="saved-header">
        <div className="header-content">
          <div className="icon-circle"><Bookmark size={32} /></div>
          <h1>Saved</h1>
          <p>Only you can see what you've saved</p>
        </div>
      </header>
      <div className="saved-tabs"><span className="active">ALL POSTS</span></div>
      <main className="saved-grid">
        {posts.length > 0 ? (
          posts.map(post => <SavedCard key={post._id} post={post} setPosts={setPosts} />)
        ) : (!loading && <div className="no-saved">No saved posts yet</div>)}
      </main>
    </div>
  );
};

export default Saved;