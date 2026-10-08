import { useEffect, useState } from 'react'
import { apiFetch } from '../api/api'

function Index() {

    const [posts, setPosts] = useState([])

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)

    const [error, setError] = useState(null)
    const [createError, setCreateError] = useState(null)


    // Load posts when the page opens
    useEffect(() => {

        async function loadPosts() {

            try {

                const data = await apiFetch('/posts')

                setPosts(data)

            } catch (error) {

                setError(error.message)

            } finally {

                setLoading(false)

            }
        }

        loadPosts()

    }, [])


    // Create a new post
    async function handleCreatePost(event) {

        event.preventDefault()

        setCreateError(null)

        setCreating(true)

        try {

            const newPost = await apiFetch('/posts', {

                method: 'POST',

                body: JSON.stringify({
                    title,
                    body,
                }),

            })

            // Add the new post to the existing list
            setPosts(currentPosts => [
                newPost,
                ...currentPosts,
            ])

            // Clear the form
            setTitle('')
            setBody('')

        } catch (error) {

            setCreateError(error.message)

        } finally {

            setCreating(false)

        }
    }


    if (loading) {

        return (
            <div>
                <h1>Posts</h1>
                <p>Loading posts...</p>
            </div>
        )
    }


    if (error) {

        return (
            <div>
                <h1>Posts</h1>

                <p style={{ color: 'red' }}>
                    Error: {error}
                </p>
            </div>
        )
    }


    return (
        <div>

            <h1>Posts</h1>


            {/* Create post */}

            <section>

                <h2>Create a post</h2>

                {createError && (
                    <p style={{ color: 'red' }}>
                        {createError}
                    </p>
                )}


                <form onSubmit={handleCreatePost}>

                    <div>
                        <label htmlFor="title">
                            Title
                        </label>

                        <br />

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            required
                            maxLength={255}
                            disabled={creating}
                        />
                    </div>


                    <div>
                        <label htmlFor="body">
                            Body
                        </label>

                        <br />

                        <textarea
                            id="body"
                            value={body}
                            onChange={(event) =>
                                setBody(event.target.value)
                            }
                            required
                            disabled={creating}
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={creating}
                    >
                        {creating
                            ? 'Creating...'
                            : 'Create Post'
                        }
                    </button>

                </form>

            </section>


            {/* Posts */}

            <section>

                <h2>All posts</h2>

                {posts.length === 0 ? (

                    <p>
                        No posts yet.
                    </p>

                ) : (

                    posts.map(post => (

                        <article key={post.id}>

                            <h3>
                                {post.title}
                            </h3>

                            <p>
                                {post.body}
                            </p>

                            <hr />

                        </article>

                    ))

                )}

            </section>

        </div>
    )
}

export default Index