import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/api'

// Define the user returned by Laravel
type User = {
    id: number
    name: string
    email: string
}

// Define the login API response
type LoginResponse = {
    token: string
    user: User
}

// Safely handle errors
function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }

    return 'An unexpected error occurred.'
}

function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault()

        setError(null)
        setLoading(true)

        try {
            const data = await apiFetch('/login', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                }),
            }) as LoginResponse

            // Save Laravel Sanctum token
            localStorage.setItem('token', data.token)

            // Save user information
            localStorage.setItem(
                'user',
                JSON.stringify(data.user)
            )

            // Go to posts
            navigate('/')
        } catch (error: unknown) {
            setError(getErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Login</h1>

            {error && (
                <p style={{ color: 'red' }}>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">
                        Email
                    </label>
                    <br />

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={event =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>
                    <br />

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={event =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p>
                Don't have an account?{' '}
                <Link to="/register">
                    Register
                </Link>
            </p>
        </div>
    )
}

export default Login