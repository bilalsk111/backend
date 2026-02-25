import React, { createContext, useState } from "react";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [feed, setFeed] = useState([]); 
    const [post, setPost] = useState(null);

    return (
        <PostContext.Provider value={{ loading, setLoading, feed, setFeed, post, setPost }}>
            {children}
        </PostContext.Provider>
    );
};