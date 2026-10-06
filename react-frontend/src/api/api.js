const API_URL = 'http://127.0.0.1:8000/api'

export async function apiFetch(url, options = {}) {

    const token =
        localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}${url}`,
        {
            ...options,

            headers: {
                Accept: 'application/json',

                Authorization:
                    `Bearer ${token}`,

                ...(options.headers || {})
            }
        }
    )

    const data =
        await response.json()

    if (!response.ok) {
        throw new Error(
            data.message || 'Request failed'
        )
    }

    return data
}
