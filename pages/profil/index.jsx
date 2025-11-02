import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchProfile } from "../../lib/profile";
import Messages from "../../components/Messages";

export default function ProfilPage({ profile }) {
  const [p, setP] = useState(profile || {});
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    name: p.name || "",
    username: p.username || "",
    email: p.email || "",
    bio: p.bio || "",
    avatar: p.avatar || "",
  });

  useEffect(() => {
    setForm({
      name: p.name || "",
      username: p.username || "",
      email: p.email || "",
      bio: p.bio || "",
      avatar: p.avatar || "",
    });
  }, [p]);
  return (
    <div className="min-h-screen bg-[#eef0f2] py-6" style={{ fontFamily: 'Newsreader, "Noto Sans", sans-serif' }}>
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border shadow-sm">
        {/* Header */}
        <header className="flex items-center justify-between px-6 md:px-8 py-3 border-b">
          <div className="flex items-center gap-10">
            <div className="text-lg font-semibold">News Today</div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-[#111418]">
              <Link href="#" className="hover:underline">For You</Link>
              <Link href="/home" className="hover:underline">News</Link>
              <Link href="#" className="hover:underline">Entertainment</Link>
              <Link href="#" className="hover:underline">Sports</Link>
              <Link href="#" className="hover:underline">Tech</Link>
              <Link href="#" className="hover:underline">Science</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/home" aria-label="Home" className="grid place-items-center size-9 rounded-full border hover:bg-gray-50">🏠</Link>
            <button aria-label="Lock" className="grid place-items-center size-9 rounded-full border hover:bg-gray-50">🔒</button>
            <button aria-label="Search" className="grid place-items-center size-9 rounded-full border hover:bg-gray-50">🔍</button>
            <Link href="/profil" aria-label="Profile" className="grid place-items-center size-9 rounded-full border overflow-hidden">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{ backgroundImage: `url("${p.avatar}")` }} />
            </Link>
          </div>
        </header>

        {/* Body */}
        <div className="px-6 md:px-8 py-6">
          <h1 className="text-2xl font-semibold text-[#111418]">Profile</h1>

          {/* Settings list */}
          <div className="mt-6 divide-y rounded-xl border">
            {/* Edit profile row */}
            <button
              className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50"
              onClick={() => setEdit((v) => !v)}
            >
              <span className="text-sm text-[#111418]">Edit profile</span>
              <span aria-hidden>›</span>
            </button>

            {/* Saved articles */}
            <Link href="#" className="flex items-center justify-between px-4 py-4 hover:bg-gray-50">
              <span className="text-sm text-[#111418]">Saved articles</span>
              <span aria-hidden>›</span>
            </Link>

            {/* Reading history */}
            <Link href="#" className="flex items-center justify-between px-4 py-4 hover:bg-gray-50">
              <span className="text-sm text-[#111418]">Reading history</span>
              <span aria-hidden>›</span>
            </Link>
          </div>

          {/* Account section */}
          <div className="mt-8">
            <div className="text-xs font-semibold text-[#111418] mb-2">Account</div>
            <div className="rounded-xl border divide-y">
              <Link href="#" className="flex items-center justify-between px-4 py-4 hover:bg-gray-50">
                <span className="text-sm text-[#111418]">Email</span>
                <span aria-hidden>›</span>
              </Link>
              <Link href="#" className="flex items-center justify-between px-4 py-4 hover:bg-gray-50">
                <span className="text-sm text-[#111418]">Password</span>
                <span aria-hidden>›</span>
              </Link>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-6">
            <button
              className="inline-flex items-center justify-center rounded-lg h-8 px-3 text-sm border hover:bg-gray-50"
              onClick={async () => {
                try {
                  await fetch('/api/auth/logout', { method: 'POST' });
                } catch {}
                if (typeof window !== "undefined") {
                  window.location.href = "/auth/login";
                }
              }}
            >
              Log out
            </button>
          </div>

          {/* Inline edit panel */}
          {edit && (
            <div className="mt-8 rounded-xl border p-4">
              {msg.text ? (
                <div className="mb-3">
                  <Messages type={msg.type}>{msg.text}</Messages>
                </div>
              ) : null}

              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSaving(true);
                  setMsg({});
                  try {
                    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                    const res = await fetch("/api/user/profile", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                      body: JSON.stringify(form),
                    });
                    if (!res.ok) throw new Error((await res.json())?.message || "Failed updating profile");
                    const updated = await res.json();
                    setP({ ...p, ...updated });
                    setEdit(false);
                    setMsg({ type: "success", text: "Profile updated successfully." });
                  } catch (err) {
                    setMsg({ type: "error", text: err.message || "Update failed." });
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#637588]">Full Name</label>
                  <input className="border rounded-md px-3 py-2" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#637588]">Username</label>
                  <input className="border rounded-md px-3 py-2" value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#637588]">Email</label>
                  <input type="email" className="border rounded-md px-3 py-2" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-sm text-[#637588]">Bio</label>
                  <textarea className="border rounded-md px-3 py-2 min-h-24" value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-sm text-[#637588]">Avatar URL</label>
                  <input className="border rounded-md px-3 py-2" value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
                </div>

                <div className="md:col-span-2 flex items-center gap-3 mt-2">
                  <button type="submit" disabled={saving}
                    className="inline-flex items-center justify-center rounded-xl h-9 px-4 bg-[#1980e6] text-white text-sm font-medium disabled:opacity-60">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" className="inline-flex items-center justify-center rounded-xl h-9 px-4 bg-[#f0f2f4] text-[#111418] text-sm"
                    onClick={() => { setEdit(false); setForm({ name: p.name||"", username: p.username||"", email: p.email||"", bio: p.bio||"", avatar: p.avatar||"" }); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// export async function getServerSideProps() {
// //   const profile = await fetchProfile();
// //   const articles = await fetchProfileArticles(profile?.id);
//   return { props: { profile, articles } };
// }
