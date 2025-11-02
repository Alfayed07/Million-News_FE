import { useState } from "react";
import { useRouter } from "next/router";
import Messages from "../../../components/Messages";
import Link from "next/link";

export default function Login({ nextPath = "/home" }) {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  return (
    <div className="min-h-screen bg-[#eef0f2] py-6" style={{ fontFamily: 'Newsreader, "Noto Sans", sans-serif' }}>
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border shadow-sm">
        <header className="flex items-center justify-between px-6 md:px-8 py-3 border-b">
          <div className="flex items-center gap-10">
            <div className="text-lg font-semibold">News Today</div>
            {/* <nav className="hidden md:flex items-center gap-6 text-sm text-[#111418]">
              <span className="text-[#637588]">For You</span>
              <span className="text-[#637588]">News</span>
              <span className="text-[#637588]">Entertainment</span>
              <span className="text-[#637588]">Sports</span>
              <span className="text-[#637588]">Tech</span>
              <span className="text-[#637588]">Science</span>
            </nav> */}
          </div>
        </header>

        <div className="px-6 md:px-8 py-10 flex justify-center">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold text-[#111418] mb-4">Login</h1>

            {msg.text ? (
              <div className="mb-3">
                <Messages type={msg.type}>{msg.text}</Messages>
              </div>
            ) : null}

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setMsg({});
                setLoading(true);
                try {
                  const resp = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                  });
                  const data = await resp.json();
                  if (!resp.ok) throw new Error(data?.message || "Login failed");
                  // token is stored in HttpOnly cookie by the API route
                  if (typeof window !== "undefined") {
                    if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
                  }
                  setMsg({ type: "success", text: "Login successful. Redirecting..." });
                  setTimeout(() => router.replace(nextPath || "/home"), 400);
                } catch (err) {
                  setMsg({ type: "error", text: err.message });
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#637588]">Username</label>
                <input
                  className="border rounded-md px-3 py-2"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="yourname"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#637588]">Password</label>
                <input
                  type="password"
                  className="border rounded-md px-3 py-2"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl h-10 px-4 bg-[#1980e6] text-white text-sm font-medium disabled:opacity-60 w-full"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <div className="mt-4 flex items-center justify-between text-sm">
              <Link href="/auth/forgot" className="text-[#1980e6] hover:underline">Forgot password?</Link>
              <Link href="/auth/register" className="text-[#1980e6] hover:underline">Create account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const token = context.req?.cookies?.token || null;
  if (token) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  const nextPath = context.query?.next || "/home";
  return { props: { nextPath } };
}
