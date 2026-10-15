

async function request(path, { method = 'GET', body, signal } = {}) {
  const response = await fetch(path, {
    method,
    signal,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const problem = await response.json().catch(() => null)
    throw new Error(problem?.error ?? `Request failed (${response.status})`)
  }

  return response.status === 204 ? null : response.json()
}

export const vehiclesApi = {
  list: (signal) => request('/api/vehicles/list', { signal }),
  get: (id, signal) => request(`/api/vehicles/${id}`, { signal }),
  create: (vehicle) => request('/api/vehicles', { method: 'POST', body: vehicle }),
  update: (id, vehicle) =>
    request(`/api/vehicles/${id}`, { method: 'PUT', body: vehicle }),
}

export const categoriesApi = {
  list: (signal) => request('/api/categories', { signal }),
  create: (category) =>
    request('/api/categories', { method: 'POST', body: category }),
  update: (id, category) =>
    request(`/api/categories/${id}`, { method: 'PUT', body: category }),
  remove: (id) => request(`/api/categories/${id}`, { method: 'DELETE' }),
}