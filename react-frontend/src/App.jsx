import { useEffect, useState } from 'react'
import { apiFetch } from './api/api'

function App() {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {

        async function loadPosts() {

            try {

                const data =
                    await apiFetch('/posts')

                setPosts(data)

            } catch (error) {

                setError(error.message)

            } finally {

                setLoading(false)

            }

        }

        loadPosts()

    }, [])


    if (loading) {
        return <h1>Loading posts...</h1>
    }


    if (error) {
        return <h1>Error: {error}</h1>
    }


    return (
        <div>

            <h1>Posts</h1>

            {posts.map(post => (

                <article key={post.id}>

                    <h2>
                        {post.title}
                    </h2>

                    <p>
                        {post.body}
                    </p>

                </article>

            ))}

        </div>
    )
}

export default App
