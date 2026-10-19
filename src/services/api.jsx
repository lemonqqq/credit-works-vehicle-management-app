async function request(path, { method = "GET", body, signal, cache } = {}) {
  if ((method === "GET" || method === "HEAD") && body !== undefined) {
    throw new Error(
      `${method} requests must use query parameters instead of a body`,
    );
  }
  const response = await fetch(path, {
    method,
    signal,
    cache,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    const fieldError =
      problem?.errors && Object.values(problem.errors).flat()[0];
    throw new Error(
      problem?.detail ??
        problem?.error ??
        fieldError ??
        problem?.title ??
        `Request failed (${response.status})`,
    );
  }

  return response.status === 204 ? null : response.json();
}

function withQuery(path, filters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export const vehiclesApi = {
  list: (signal) => request("/api/vehicles/search", { signal }),
  search: (filters, signal) =>
    request(withQuery("/api/vehicles/search", filters), { signal }),
  get: (id, signal) => request(`/api/vehicles/${id}`, { signal }),
  create: (vehicle) =>
    request("/api/vehicles", { method: "POST", body: vehicle }),
  update: (id, vehicle) =>
    request(`/api/vehicles/${id}`, { method: "PUT", body: vehicle }),
};

export const categoriesApi = {
  list: (signal) =>
    request("/api/categories/list", { signal, cache: "no-store" }),
  confirm: (categories) =>
    request("/api/categories", {
      method: "PATCH",
      body: Array.isArray(categories) ? { categories } : categories,
    }),
};
