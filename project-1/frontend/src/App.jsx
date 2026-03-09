import React from "react";
import { router } from "./app.routes";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { RouterProvider } from "react-router-dom";
import { PostProvider } from "./features/post/post.context.jsx";
// import "./features/shared/index.scss";

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
