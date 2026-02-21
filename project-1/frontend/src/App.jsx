import React from 'react'
import { router } from './app.routes'
import { AuthProvider } from './features/auth/auth.context.jsx'
import { RouterProvider } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <AuthProvider>
       <RouterProvider router={router} />
      </AuthProvider>
    </div>
  )
}

export default App
