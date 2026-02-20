import React from 'react'
import { AppRoutes } from './AppRouter'
import { AuthProvider } from './features/auth/auth.context'

const App = () => {
  return (
    <div>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  )
}

export default App
