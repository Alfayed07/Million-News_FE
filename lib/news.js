import api from "../config/axios/axios";

// NOTE: Endpoints here are assumptions and can be aligned with your backend.
// Expected backend endpoints:
// - GET /news/top -> { items: [{ id, title, description, image }, ...] }
// - GET /news?category=national -> same shape
// - GET /news/trending -> { items: [{ id, title }, ...] }

export async function fetchTopStories(limit = 24) {
  try {
    const { data } = await api.get("/news/top", { params: { limit } });
    const items = Array.isArray(data?.items) ? data.items : data;
    return normalizeItems(items);
  } catch (e) {
    return mockTopStories();
  }
}

export async function fetchCategory(category) {
  try {
    const { data } = await api.get("/news", { params: { category } });
    const items = Array.isArray(data?.items) ? data.items : data;
    return normalizeItems(items);
  } catch (e) {
    return mockCategory(category);
  }
}

export async function fetchCategoryPaged(category, page = 1, limit = 10) {
  try {
    const { data } = await api.get("/news", { params: { category, page, limit } });
    const items = normalizeItems(Array.isArray(data?.items) ? data.items : []);
    return { items, total: data?.total ?? items.length, page: data?.page ?? page, limit: data?.limit ?? limit };
  } catch (e) {
    const items = mockCategory(category);
    return { items, total: items.length, page, limit };
  }
}

export async function fetchTrending() {
  try {
    const { data } = await api.get("/news/trending");
    return Array.isArray(data?.items) ? data.items : data;
  } catch (e) {
    return mockTrending();
  }
}

export async function fetchSearch(q) {
  if (!q || !String(q).trim()) return [];
  try {
    const { data } = await api.get("/news/search", { params: { q } });
    const items = Array.isArray(data?.items) ? data.items : data;
    return normalizeItems(items);
  } catch (e) {
    // Fallback: naive client-side filter from mocks
    const hay = [
      ...mockTopStories(),
      ...mockCategory("national"),
      ...mockCategory("international"),
      ...mockCategory("sports"),
      ...mockCategory("entertainment"),
      ...mockCategory("technology"),
    ];
    const term = String(q).toLowerCase();
    return hay.filter(
      (x) =>
        x?.title?.toLowerCase().includes(term) ||
        x?.description?.toLowerCase().includes(term)
    );
  }
}

export async function fetchSearchPaged(q, page = 1, limit = 10) {
  if (!q || !String(q).trim()) return { items: [], total: 0, page, limit };
  try {
    const { data } = await api.get("/news/search", { params: { q, page, limit } });
    const items = normalizeItems(Array.isArray(data?.items) ? data.items : []);
    return { items, total: data?.total ?? items.length, page: data?.page ?? page, limit: data?.limit ?? limit };
  } catch (e) {
    // Fallback client-side
    const items = await fetchSearch(q);
    return { items, total: items.length, page, limit };
  }
}

export async function fetchNewsById(id) {
  if (!id) return null;
  try {
    const { data } = await api.get(`/news/${encodeURIComponent(id)}`);
    const item = data?.item || data;
    return normalizeItem(item);
  } catch (e) {
    // fallback: scan mocks
    const hay = [
      ...mockTopStories(),
      ...mockCategory("national"),
      ...mockCategory("international"),
      ...mockCategory("sports"),
      ...mockCategory("entertainment"),
      ...mockCategory("technology"),
    ];
    return hay.find((x) => String(x.id) === String(id)) || null;
  }
}

// Helpers to ensure FE always has description, image fields
function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeItem);
}

function normalizeItem(x = {}) {
  const rawImage = x.image || x.imageUrl || x.imageURL || x.ImageURL;
  const image = ensureImage(rawImage);
  // Description fallback to content (sliced) if missing
  const description = x.description || sliceText(x.content || x.Content || x.body, 180);
  const created_at = x.created_at || x.createdAt || null;
  const published_at = x.published_at || x.publishedAt || null;
  return { ...x, image, description, created_at, published_at };
}

function ensureImage(src) {
  if (!src || typeof src !== "string") {
    return "/news-placeholder.svg";
  }
  const s = src.trim();
  // Accept absolute http(s) and root-relative paths
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) {
    return s;
  }
  // Occasionally BE may return bytea-base64 of a URL text; try to decode basic cases
  try {
    const decoded = atobSafe(s);
    if (decoded && (decoded.startsWith("http://") || decoded.startsWith("https://"))) {
      return decoded;
    }
  } catch {}
  return "/news-placeholder.svg";
}

function atobSafe(v) {
  if (typeof window !== "undefined" && window.atob) return window.atob(v);
  // Node.js SSR
  return Buffer.from(v, "base64").toString("utf-8");
}

function sliceText(text, max = 180) {
  if (!text) return "";
  const t = String(text).trim();
  if (t.length <= max) return t;
  // Cut at nearest space for nicer excerpt
  const cut = t.slice(0, max);
  const idx = cut.lastIndexOf(" ");
  return (idx > 40 ? cut.slice(0, idx) : cut) + "…";
}

// --- Mock fallbacks to keep the page working before backend is wired ---
function mockTopStories() {
  return [
    {
      id: "1",
      title: "Government Announces New Economic Plan to Boost Job Growth",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image:
        "https://cdn.usegalileo.ai/sdxl10/c211285b-0fdc-46ee-9467-9471799200dd.png",
    },
    {
      id: "2",
      title:
        "Tech Giant Unveils Latest Smartphone Model with Advanced Features",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image:
        "https://cdn.usegalileo.ai/sdxl10/5adb2e21-9930-44df-b4ec-db97de1aabce.png",
    },
  ];
}

function mockCategory(category) {
  const meta = {
    national: {
      title: "Major Infrastructure Project Commences in Urban Area",
      image:
        "https://cdn.usegalileo.ai/sdxl10/1b4e4999-22c0-4cdb-9108-1eb705926672.png",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
    },
    international: {
      title: "Global Leaders Gather for Climate Change Summit",
      image:
        "https://cdn.usegalileo.ai/sdxl10/8828f888-53e6-4f22-bb84-2b9aa07fbb28.png",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
    },
    sports: {
      title:
        "Local Team Advances to Championship Final After Thrilling Match",
      image:
        "https://cdn.usegalileo.ai/sdxl10/e2889238-c105-4e30-a631-aa160eaac60f.png",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
    },
    entertainment: {
      title:
        "Critically Acclaimed Film Wins Multiple Awards at Prestigious Ceremony",
      image:
        "https://cdn.usegalileo.ai/sdxl10/61b57916-209b-40ef-b96b-a9b45e1f051c.png",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
    },
    technology: {
      title:
        "Breakthrough in Artificial Intelligence Research Leads to New Possibilities",
      image:
        "https://cdn.usegalileo.ai/sdxl10/234de126-415d-46ed-8e08-36459d31471b.png",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
    },
  }[category];

  const m = meta || {};
  return [
    {
      id: `${category}-1`,
      title: m.title || `${category} headline`,
      description:
        m.description ||
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
      image:
        m.image ||
        `https://picsum.photos/seed/${encodeURIComponent(category)}/800/450`,
    },
  ];
}

function mockTrending() {
  return [
    { id: "t1", title: "New Environmental Regulations" },
    { id: "t2", title: "Summer Travel Safety Tips" },
    { id: "t3", title: "Stock Market Update" },
  ];
}
