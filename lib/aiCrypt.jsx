// Minimal placeholder: symmetric encode/decode using base64 (for demo only)
export function aiEncrypt(plain) {
  try {
    return typeof window === "undefined"
      ? Buffer.from(String(plain), "utf8").toString("base64")
      : btoa(String(plain));
  } catch {
    return String(plain);
  }
}

export function aiDecrypt(encoded) {
  try {
    return typeof window === "undefined"
      ? Buffer.from(String(encoded), "base64").toString("utf8")
      : atob(String(encoded));
  } catch {
    return String(encoded);
  }
}
