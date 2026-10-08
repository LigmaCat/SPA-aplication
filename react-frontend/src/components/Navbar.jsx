import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/api'

function Navbar() {

    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const user = JSON.parse(
        localStorage.getItem('user')
    )

    async function handleLogout() {

        try {

            await apiFetch('/logout', {
                method: 'POST',
            })

        } catch (error) {

            console.error(
                'Logout failed:',
                error
            )

        } finally {

            localStorage.removeItem('token')
            localStorage.removeItem('user')

            navigate('/login')
        }
    }


    return (
        <nav>

            <div>
                <a href="/">
                    My Blog
                </a>
            </div>


            <div>

                {token ? (

                    <>
                        <span>
                            Hello, {user?.name}
                        </span>

                        {' '}

                        <button
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>

                ) : (

                    <>
                        <a href="/login">
                            Login
                        </a>

                        {' '}

                        <a href="/register">
                            Register
                        </a>
                    </>

                )}

            </div>

        </nav>
    )
}

export default Navbar