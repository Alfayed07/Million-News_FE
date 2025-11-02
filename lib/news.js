import api from "../config/axios/axios";

// NOTE: Endpoints here are assumptions and can be aligned with your backend.
// Expected backend endpoints:
// - GET /news/top -> { items: [{ id, title, description, image }, ...] }
// - GET /news?category=national -> same shape
// - GET /news/trending -> { items: [{ id, title }, ...] }

export async function fetchTopStories() {
  try {
    const { data } = await api.get("/news/top");
    return Array.isArray(data?.items) ? data.items : data;
  } catch (e) {
    return mockTopStories();
  }
}

export async function fetchCategory(category) {
  try {
    const { data } = await api.get("/news", { params: { category } });
    return Array.isArray(data?.items) ? data.items : data;
  } catch (e) {
    return mockCategory(category);
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
    return Array.isArray(data?.items) ? data.items : data;
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

export async function fetchNewsById(id) {
  if (!id) return null;
  try {
    const { data } = await api.get(`/news/${encodeURIComponent(id)}`);
    return data?.item || data;
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
