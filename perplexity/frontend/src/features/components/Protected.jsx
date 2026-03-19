import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const Protected = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    
    // Agar sach mein user null hai, tabhi login par bhejo
    if (!user) {
        // console.log("Protected Route ne dhakka mara!"); // Agar aapko check karna ho
        return <Navigate to="/login" replace />
    }

    // Agar user hai toh usko Dashboard dikhao
    return children
}

export default Protected