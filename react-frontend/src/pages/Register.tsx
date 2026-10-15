import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/api'

// Define the user returned by Laravel
type User = {
    id: number
    name: string
    email: string
}

// Define the registration API response
type RegisterResponse = {
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

function Register() {
    const navigate = useNavigate()

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirmation, setPasswordConfirmation] =
        useState<string>('')

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault()

        setError(null)

        if (password !== passwordConfirmation) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)

        try {
            const data = await apiFetch('/register', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            }) as RegisterResponse

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
            <h1>Register</h1>

            {error && (
                <p style={{ color: 'red' }}>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">
                        Name
                    </label>
                    <br />

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={event =>
                            setName(event.target.value)
                        }
                        required
                    />
                </div>

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

                <div>
                    <label htmlFor="passwordConfirmation">
                        Confirm password
                    </label>
                    <br />

                    <input
                        id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        onChange={event =>
                            setPasswordConfirmation(event.target.value)
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? 'Creating account...'
                        : 'Register'}
                </button>
            </form>

            <p>
                Already have an account?{' '}
                <Link to="/login">
                    Login
                </Link>
            </p>
        </div>
    )
}

export default Register