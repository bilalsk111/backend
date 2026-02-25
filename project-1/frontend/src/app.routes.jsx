import {createBrowserRouter} from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Feed from './features/post/pages/Feed'
import CreatePost from './features/post/pages/CreatePost'

export const router = createBrowserRouter([
    {
        path: '/feed',
        element: <Feed />
    },
    {
        path: '/create',
        element: <CreatePost />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path:'/login',
        element: <Login />
    }
])


// import { createBrowserRouter, Navigate } from "react-router-dom";
// import Login from "./features/auth/pages/Login";
// import Register from "./features/auth/pages/Register";
// import Feed from "./features/auth/pages/Feed";
// import { useAuth } from "./features/auth/hooks/useAuth";

// const Protected = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) return null;

//   return user ? children : <Navigate to="/login" />;
// };
// const Public = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) return null;

//   return user ? <Navigate to="/feed" /> : children;
// };
// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Navigate to="/feed" />,
//   },
//   {
//     path: "/login",
//     element: (
//       <Public>
//         <Login />
//       </Public>
//     ),
//   },
//   {
//     path: "/register",
//     element: (
//       <Public>
//         <Register />
//       </Public>
//     ),
//   },
//   {
//     path: "/feed",
//     element: (
//       <Protected>
//         <Feed />
//       </Protected>
//     ),
//   },
// ]);