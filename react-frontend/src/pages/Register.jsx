import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/api'

function Register() {

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event) {

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
            })

            // Laravel gives us a token immediately
            localStorage.setItem(
                'token',
                data.token
            )

            // Save the user
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

            <h1>Register</h1>

            {error && (
                <p style={{ color: 'red' }}>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div>
                    <label>
                        Name
                    </label>

                    <br />

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                    />
                </div>


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


                <div>
                    <label>
                        Confirm password
                    </label>

                    <br />

                    <input
                        type="password"
                        value={passwordConfirmation}
                        onChange={(event) =>
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
                        : 'Register'
                    }
                </button>

            </form>


            <p>
                Already have an account?
                {' '}
                <a href="/login">
                    Login
                </a>
            </p>

        </div>
    )
}

export default Register