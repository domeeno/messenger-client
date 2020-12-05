const API_URL = 'http://localhost:8080'

export async function fetchMessages () {
    const response = await fetch(`${API_URL}/api/messages`)
    return response.json()
}