import React, { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from "../app/app.routes"
import { useAuth } from '../features/auth/hook/useAuth'
import { Loader2 } from 'lucide-react'

const App = () => {
  const auth = useAuth()
  // Naya state jo app ko wait karwayega
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // App start hote hi pehle user check karo, phir router dikhao
    auth.handleGetMe().finally(() => {
      setIsCheckingAuth(false)
    })
  }, [])

  // Jab tak check ho raha hai, Loading screen dikhao
  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-[#31b8c6]" size={40} />
      </div>
    )
  }

  return (
    <div className='w-full h-screen bg-zinc-900 text-white'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App