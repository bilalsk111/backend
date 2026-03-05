import React from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../../home/components/Player' // Adjust path as needed
import '../../home/style/Home.scss'
import { useSong } from '../hooks/useSong'

const Home = () => {
  const {handleGetSong} = useSong()

  return (
    <div className="home-layout">
      <section className="scanner-section">
        <FaceExpression
        onClick={(expression)=>{handleGetSong({mood:expression})}}
        />
      </section>
      <footer className="player-section">
        <Player />
      </footer>
    </div>
  )
}

export default Home