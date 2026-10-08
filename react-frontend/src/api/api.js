const API_URL = 'http://127.0.0.1:8000/api'

export async function apiFetch(url, options = {}) {

    const token = localStorage.getItem('token')

    const headers = {
        Accept: 'application/json',
        ...(options.headers || {}),
    }

    // Only send Authorization if the user is logged in
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    // Add JSON content type when sending a body
    if (options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(
        `${API_URL}${url}`,
        {
            ...options,
            headers,
        }
    )

    // Some Laravel responses may not contain JSON
    const contentType = response.headers.get('content-type')

    const data = contentType?.includes('application/json')
        ? await response.json()
        : null

    if (!response.ok) {
        throw new Error(
            data?.message || 'Request failed'
        )
    }

    return data
}