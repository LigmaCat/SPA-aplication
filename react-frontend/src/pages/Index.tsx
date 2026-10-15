import { useEffect, useState, type FormEvent } from 'react'
import { apiFetch } from '../api/api'

// Describe the structure of a post returned by Laravel
type Post = {
    id: number
    title: string
    body: string
}

// Convert unknown errors into readable messages
function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }

    return 'An unexpected error occurred.'
}

function Index() {
    const [posts, setPosts] = useState<Post[]>([])

    const [title, setTitle] = useState<string>('')
    const [body, setBody] = useState<string>('')

    const [loading, setLoading] = useState<boolean>(true)
    const [creating, setCreating] = useState<boolean>(false)

    const [error, setError] = useState<string | null>(null)
    const [createError, setCreateError] = useState<string | null>(null)

    const [deletingPostId, setDeletingPostId] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    // Load posts when the page opens
    useEffect(() => {
        async function loadPosts() {
            try {
                const data = await apiFetch('/posts') as Post[]
                setPosts(data)
            } catch (error: unknown) {
                setError(getErrorMessage(error))
            } finally {
                setLoading(false)
            }
        }

        loadPosts()
    }, [])

    // Create a new post
    async function handleCreatePost(
        event: FormEvent<HTMLFormElement>
    ): Promise<void> {
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
            }) as Post

            setPosts(currentPosts => [
                newPost,
                ...currentPosts,
            ])

            setTitle('')
            setBody('')
        } catch (error: unknown) {
            setCreateError(getErrorMessage(error))
        } finally {
            setCreating(false)
        }
    }

    // Delete a post
    async function handleDeletePost(
        postId: number
    ): Promise<void> {
        const confirmed = window.confirm(
            'Are you sure you want to delete this post?'
        )

        if (!confirmed) return

        setDeleteError(null)
        setDeletingPostId(postId)

        try {
            await apiFetch(`/posts/${postId}`, {
                method: 'DELETE',
            })

            setPosts(currentPosts =>
                currentPosts.filter(post => post.id !== postId)
            )
        } catch (error: unknown) {
            setDeleteError(getErrorMessage(error))
        } finally {
            setDeletingPostId(null)
        }
    }

    // Loading state
    if (loading) {
        return (
            <div>
                <h1>Posts</h1>
                <p>Loading posts...</p>
            </div>
        )
    }

    // Loading error
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
                            onChange={event =>
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
                            onChange={event =>
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
                        {creating ? 'Creating...' : 'Create Post'}
                    </button>
                </form>
            </section>

            {/* Posts */}
            <section>
                <h2>All posts</h2>

                {deleteError && (
                    <p style={{ color: 'red' }}>
                        Error deleting post: {deleteError}
                    </p>
                )}

                {posts.length === 0 ? (
                    <p>No posts yet.</p>
                ) : (
                    posts.map(post => (
                        <article key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.body}</p>

                            <button
                                type="button"
                                onClick={() =>
                                    handleDeletePost(post.id)
                                }
                                disabled={deletingPostId !== null}
                            >
                                {deletingPostId === post.id
                                    ? 'Deleting...'
                                    : 'Delete Post'}
                            </button>

                            <hr />
                        </article>
                    ))
                )}
            </section>
        </div>
    )
}

export default Index