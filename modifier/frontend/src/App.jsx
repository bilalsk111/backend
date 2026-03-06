import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app.route";
import { AuthProvider } from "./features/auth/auth.context";
import { SongProvider } from "./features/home/song.context";
import { MusicProvider } from "./features/home/MusicContext";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <SongProvider>
            <MusicProvider>
              <RouterProvider router={router} />
            </MusicProvider>
        </SongProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
