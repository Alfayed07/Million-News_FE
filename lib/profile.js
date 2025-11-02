import api from "../config/axios/axios";

export async function fetchProfile() {
  try {
    const { data } = await api.get("/user/profile");
    return data?.profile || data;
  } catch (e) {
    return mockProfile();
  }
}

export async function fetchProfileArticles(userId) {
  try {
    const { data } = await api.get("/user/articles", { params: { userId } });
    return Array.isArray(data?.items) ? data.items : data;
  } catch (e) {
    return mockProfileArticles();
  }
}

function mockProfile() {
  return {
    id: "u1",
    name: "Alex Journalist",
    username: "alexj",
    email: "alex@example.com",
    avatar:
      "https://cdn.usegalileo.ai/sdxl10/ca674659-8fe0-4026-9c16-42713ba26d5c.png",
    joinedAt: "2023-01-12T00:00:00.000Z",
    bio: "Reporter covering tech and national policy.",
    stats: { articles: 128, followers: 2_350, following: 180 },
  };
}

function mockProfileArticles() {
  return [
    {
      id: "pa-1",
      title: "Inside the Latest Smartphone Launch",
      description:
        "A quick look at the features and implications of the newest flagship smartphone.",
      image:
        "https://cdn.usegalileo.ai/sdxl10/5adb2e21-9930-44df-b4ec-db97de1aabce.png",
    },
    {
      id: "pa-2",
      title: "Infrastructure Plan: What It Means for Cities",
      description:
        "Breaking down the funding, timelines, and expected outcomes of the urban infrastructure plan.",
      image:
        "https://cdn.usegalileo.ai/sdxl10/1b4e4999-22c0-4cdb-9108-1eb705926672.png",
    },
  ];
}
