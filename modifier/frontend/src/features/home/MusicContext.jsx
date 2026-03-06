import { createContext, useState } from "react";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (song) => {
    setFavorites((prev) => {
      if (prev.find((s) => s._id === song._id)) return prev;
      return [...prev, song];
    });
  };

  return (
    <MusicContext.Provider value={{ favorites, addFavorite }}>
      {children}
    </MusicContext.Provider>
  );
};
