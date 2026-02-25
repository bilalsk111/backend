import React from "react";
import { router } from "./app.routes";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { RouterProvider } from "react-router-dom";
import { PostProvider } from "./features/post/post.context.jsx";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <PostProvider>
          <RouterProvider router={router} />
        </PostProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
