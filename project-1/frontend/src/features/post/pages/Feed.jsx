import React, { useEffect } from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import { usePost } from '../hook/usePost'
import Sidebar from '../components/Sidebar'

const Feed = () => {

    const { feed, handleGetFeed,loading } = usePost()

    useEffect(() => { 
        handleGetFeed()
    }, [])

    if(loading || !feed){
        return (<main><h1>Feed is loading...</h1></main>)
    }

    return (
        <main className='feed-page' >
            <div className="feed">
                <div className="posts">
                    {feed.map(post=>{
                        return <Post key={post._id}  user={post.user} post={post} />
                    })}
                </div>
                <Sidebar />
            </div>
        </main>
    )
}

export default Feed