import {createBrowserRouter} from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Feed from './features/auth/pages/Feed'

export const router = createBrowserRouter([
    {
        path: '/feed',
        element: <Feed />
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
