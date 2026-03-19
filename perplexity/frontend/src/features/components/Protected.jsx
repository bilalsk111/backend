import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const Protected = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Agar user hai toh usko Dashboard dikhao
    return children
}

export default Protected