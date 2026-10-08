import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/api'

function Login() {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event) {

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
            })

            // Save Laravel Sanctum token
            localStorage.setItem(
                'token',
                data.token
            )

            // Save user information
            localStorage.setItem(
                'user',
                JSON.stringify(data.user)
            )

            // Go to posts
            navigate('/')

        } catch (error) {

            setError(error.message)

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
                    <label>
                        Email
                    </label>

                    <br />

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>


                <div>
                    <label>
                        Password
                    </label>

                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>


                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? 'Logging in...'
                        : 'Login'
                    }
                </button>

            </form>

            <p>
                Don't have an account?
                {' '}
                <a href="/register">
                    Register
                </a>
            </p>

        </div>
    )
}

export default Login