import api from "../config/axios/axios";

export async function fetchDrafts(page=1, limit=10) {
  const { data } = await api.get("/manage/news/drafts", { params: { page, limit }});
  return data;
}
export async function fetchMine(page=1, limit=10) {
  const { data } = await api.get("/manage/news/mine", { params: { page, limit }});
  return data;
}
export async function createDraft(payload) {
  const { data } = await api.post("/manage/news", payload);
  return data.item || data;
}
export async function updateNews(id, payload) {
  const { data } = await api.put(`/manage/news/${id}`, payload);
  return data.item || data;
}
export async function publishNews(id) {
  const { data } = await api.post(`/manage/news/${id}/publish`);
  return data.item || data;
}
export async function archiveNews(id) {
  const { data } = await api.post(`/manage/news/${id}/archive`);
  return data.item || data;
}
export async function fetchCategories() {
  const { data } = await api.get("/categories");
  return data.items || [];
}
