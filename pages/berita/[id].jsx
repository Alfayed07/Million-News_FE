import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchNewsById } from "../../lib/news";
import api from "../../config/axios/axios";

function toParagraphs(text) {
  if (!text) return [];
  const normalized = String(text).replace(/\r\n/g, "\n").trim();
  // If content already has blank lines/newlines, split by empty line
  const byBlankLine = normalized.split(/\n\s*\n/).filter(Boolean);
  if (byBlankLine.length > 1) return byBlankLine;
  // Otherwise, split by sentence boundaries and group to ~400 chars per paragraph
  const sentences = normalized.split(/(?<=[.!?])\s+(?=[A-Z0-9])/);
  const paras = [];
  let buf = "";
  for (const s of sentences) {
    const next = buf ? buf + " " + s : s;
    if (next.length > 400 && buf) {
      paras.push(buf.trim());
      buf = s;
    } else {
      buf = next;
    }
  }
  if (buf) paras.push(buf.trim());
  return paras;
}

export default function BeritaDetail({ item, initialComments = [] }) {
  // Record a view on mount (client-side only)
  useEffect(() => {
    if (!item?.id) return;
    fetch(`/api/news/${encodeURIComponent(item.id)}/view`, { method: "POST" }).catch(() => {});
  }, [item?.id]);
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#637588]">Article not found.</div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Newsreader, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-[#111418]">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_319)">
                    <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                  </g>
                </svg>
              </div>
              <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Milion News</h2>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <Link href="/home" className="text-sm text-[#637588] hover:underline">Back to Home</Link>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-6">
          <article className="layout-content-container flex flex-col max-w-[960px] flex-1 gap-4">
            <h1 className="text-[#111418] text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">{item.title}</h1>
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
              style={{ backgroundImage: `url("${item.image}")` }}
            />
            {item.content ? (
              <div className="max-w-none space-y-6 md:space-y-8">
                {toParagraphs(item.content).map((p, i) => (
                  <p
                    key={i}
                    className="text-[#1b1f23] text-[18px] md:text-[19px] leading-8 md:leading-9"
                  >
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              item.description && (
                <p className="text-[#1b1f23] text-[18px] md:text-[19px] leading-8 md:leading-9 mt-6 md:mt-8">{item.description}</p>
              )
            )}

            {/* Comments Section */}
            <section className="mt-10 md:mt-12 border-t border-[#f0f2f4] pt-8 md:pt-10">
              <CommentsSection newsId={item.id} initialItems={initialComments} />
            </section>
          </article>
        </div>

        <footer className="px-40 py-6 border-t border-solid border-[#f0f2f4] bg-[#f8f9fa]">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-[#111418]">
                <div className="size-4">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_6_319)">
                      <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                    </g>
                  </svg>
                </div>
                <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Milion News</h2>
              </div>
              <p className="text-[#637588] text-sm">© {new Date().getFullYear()} Milion News. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const item = await fetchNewsById(params?.id);
  let initialComments = [];
  try {
    const { data } = await api.get(`/news/${encodeURIComponent(params?.id)}/comments`);
    initialComments = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
  } catch {}
  return { props: { item: item || null, initialComments } };
}

function CommentsSection({ newsId, initialItems = [] }) {
  const [comments, setComments] = useState(initialItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [needLogin, setNeedLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        setLoading(true);
        // Fetch comments
        const res = await fetch(`/api/news/${encodeURIComponent(newsId)}/comments`);
        if (!res.ok) throw new Error(`Failed to load comments (${res.status})`);
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        if (mounted) setComments(items);
      } catch (e) {
        if (mounted) setError(e.message || "Gagal memuat komentar");
      } finally {
        if (mounted) setLoading(false);
      }

      // Try fetch current user (optional)
      try {
        const me = await fetch(`/api/user/profile`);
        if (me.ok) {
          const u = await me.json();
          if (mounted) setCurrentUser(u?.user || u);
        }
      } catch {}
    }
    run();
    return () => {
      mounted = false;
    };
  }, [newsId]);

  async function handlePost(e) {
    e?.preventDefault?.();
    if (!content.trim()) return;
    setPosting(true);
    setNeedLogin(false);
    try {
      const res = await fetch(`/api/news/${encodeURIComponent(newsId)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (res.status === 401 || res.status === 403) {
        setNeedLogin(true);
        return;
      }
      if (!res.ok) throw new Error(`Gagal mengirim komentar (${res.status})`);
      // Ensure SSR-refresh to reflect latest list from BE
      if (typeof window !== "undefined") {
        window.location.reload();
        return;
      }
    } catch (e) {
      setError(e.message || "Gagal mengirim komentar");
    } finally {
      setPosting(false);
    }
  }

  function displayName(c) {
    return c?.name || c?.username || c?.user?.name || c?.user?.username || "Anonim";
  }
  function avatarUrl(c) {
    return c?.avatar || c?.user?.avatar || "/default-avatar.svg";
  }
  function displayDate(c) {
    const d = c?.created_at || c?.createdAt || c?.created_at_utc;
    if (!d) return "";
    try {
      const dt = new Date(d);
      return dt.toLocaleString();
    } catch {
      return String(d);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl md:text-2xl font-semibold text-[#111418]">Komentar</h2>

      {/* Form */}
      <form onSubmit={handlePost} className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Image
            src={currentUser?.avatar || "/default-avatar.svg"}
            alt="avatar"
            width={36}
            height={36}
            unoptimized
            className="rounded-full object-cover border border-[#eef1f3]"
          />
          <div className="flex-1">
            <textarea
              className="w-full min-h-[90px] rounded-lg border border-[#e4e8ec] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1f6feb] text-[15px] placeholder:text-[#9aa6b2]"
              placeholder={needLogin ? "Silakan login untuk berkomentar" : "Tulis komentar Anda…"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={posting}
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={posting || !content.trim()}
                className="inline-flex items-center rounded-md bg-[#1f6feb] px-4 py-2 text-white text-sm font-medium hover:bg-[#1a5ed1] disabled:opacity-50"
              >
                {posting ? "Mengirim…" : "Kirim"}
              </button>
              {needLogin && (
                <span className="text-sm text-[#637588]">
                  Anda perlu <Link href="/auth/login" className="text-[#1f6feb] hover:underline">login</Link> untuk berkomentar.
                </span>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* States */}
      {loading && <p className="text-[#637588] text-sm">Memuat komentar…</p>}
      {!!error && !loading && (
        <p className="text-[#c0392b] text-sm">{error}</p>
      )}

      {/* List */}
      {!loading && !error && (
        comments?.length ? (
          <ul className="flex flex-col gap-5">
            {comments.map((c, idx) => (
              <li key={c.id || idx} className="flex items-start gap-3">
                <Image
                  src={avatarUrl(c)}
                  alt={displayName(c)}
                  width={36}
                  height={36}
                  unoptimized
                  className="rounded-full object-cover border border-[#eef1f3]"
                />
                <div className="flex-1">
                  <div className="flex gap-2 items-baseline">
                    <span className="text-[15px] font-medium text-[#111418]">{displayName(c)}</span>
                    <span className="text-[12px] text-[#9aa6b2]">{displayDate(c)}</span>
                  </div>
                  <p className="mt-1 text-[15px] leading-6 text-[#1b1f23] whitespace-pre-line">{c.content || c.text || ""}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[#637588] text-sm">Belum ada komentar.</p>
        )
      )}
    </div>
  );
}
