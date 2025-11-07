import api from "../config/axios/axios";

export async function fetchCategories() {
  try {
    const { data } = await api.get("/categories");
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    // Normalize: ensure each item has name and id
    return items
      .filter(Boolean)
      .map((c) => ({ id: c.id ?? c.ID ?? c.Id ?? String(c.name || c.Name), name: c.name || c.Name || String(c) }));
  } catch {
    // Fallback set if BE not available
    return [
      { id: "national", name: "national" },
      { id: "international", name: "international" },
      { id: "sports", name: "sports" },
      { id: "entertainment", name: "entertainment" },
      { id: "technology", name: "technology" },
    ];
  }
}
