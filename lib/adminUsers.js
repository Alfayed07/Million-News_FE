export async function fetchUsers(params = {}) {
  const { page = 1, limit = 10, search = "" } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) query.set("search", search);

  const response = await fetch(`/api/manage/users?${query.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "same-origin",
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || "Failed to fetch users";
    throw new Error(message);
  }
  return data;
}

export async function updateUserAccess(id, payload) {
  const response = await fetch(`/api/manage/users/${id}/access`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "same-origin",
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || "Failed to update user access";
    const error = new Error(message);
    error.response = { data };
    throw error;
  }
  return data.item || data;
}
