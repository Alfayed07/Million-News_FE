import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Messages from "../../../components/Messages";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Password validation rules
  const passRules = useMemo(() => {
    const p = form.password || "";
    return {
      length: p.length >= 7,
      lower: /[a-z]/.test(p),
      upper: /[A-Z]/.test(p),
      number: /\d/.test(p),
      special: /[^A-Za-z0-9]/.test(p),
      match: form.confirmPassword === form.password && p.length > 0,
    };
  }, [form.password, form.confirmPassword]);

  function firstPassError() {
    if (!passRules.length) return "Kata sandi harus minimal 7 karakter";
    if (!(passRules.lower && passRules.upper)) return "Kata sandi harus mengandung huruf kecil dan huruf besar";
    if (!passRules.number) return "Kata sandi harus mengandung setidaknya satu angka";
    if (!passRules.special) return "Kata sandi harus mengandung setidaknya satu karakter khusus";
    if (!passRules.match) return "Konfirmasi kata sandi tidak cocok";
    return null;
  }

  useEffect(() => {
    const hasToken = document.cookie.includes("token=");
    if (hasToken) router.replace("/home");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#eef0f2] py-6" style={{ fontFamily: 'Newsreader, "Noto Sans", sans-serif' }}>
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border shadow-sm">
        <header className="flex items-center justify-between px-6 md:px-8 py-3 border-b">
          <div className="flex items-center gap-10">
            <div className="text-lg font-semibold">News Today</div>
          </div>
        </header>
        <div className="px-6 md:px-8 py-10 flex justify-center">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold text-[#111418] mb-4">Create account</h1>
            {msg.text ? (
              <div className="mb-3"><Messages type={msg.type}>{msg.text}</Messages></div>
            ) : null}
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault(); setMsg({}); setLoading(true);
              try {
                const err = firstPassError();
                if (err) { throw new Error(err); }
                const resp = await fetch("/api/auth/register", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(form)});
                const data = await resp.json();
                if (!resp.ok) throw new Error(data?.message || "Registration failed");
                setMsg({ type: "success", text: "Registration successful. Please login." });
                setTimeout(()=> router.replace("/auth/login"), 500);
              } catch(err) { setMsg({ type: "error", text: err.message }); }
              finally { setLoading(false); }
            }}>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#637588]">Username</label>
                <input className="border rounded-md px-3 py-2" value={form.username} onChange={(e)=> setForm({...form, username: e.target.value})} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#637588]">Email</label>
                <input type="email" className="border rounded-md px-3 py-2" value={form.email} onChange={(e)=> setForm({...form, email: e.target.value})} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#637588]">Password</label>
                <input type="password" className="border rounded-md px-3 py-2" value={form.password} onChange={(e)=> setForm({...form, password: e.target.value})} required />
                {/* Password rules checklist */}
                <ul className="mt-2 space-y-1 text-xs">
                  <li className={passRules.length ? "text-green-600" : "text-[#637588]"}>• Minimal 7 karakter</li>
                  <li className={(passRules.lower && passRules.upper) ? "text-green-600" : "text-[#637588]"}>• Mengandung huruf kecil dan huruf besar</li>
                  <li className={passRules.number ? "text-green-600" : "text-[#637588]"}>• Mengandung angka</li>
                  <li className={passRules.special ? "text-green-600" : "text-[#637588]"}>• Mengandung karakter khusus</li>
                </ul>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#637588]">Konfirmasi Password</label>
                <input type="password" className="border rounded-md px-3 py-2" value={form.confirmPassword} onChange={(e)=> setForm({...form, confirmPassword: e.target.value})} required />
                <p className={`mt-1 text-xs ${passRules.match ? "text-green-600" : "text-[#637588]"}`}>• Harus sama dengan password</p>
              </div>
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-xl h-10 px-4 bg-[#1980e6] text-white text-sm font-medium disabled:opacity-60 w-full">{loading?"Creating...":"Create account"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context){
  const token = context.req?.cookies?.token || null;
  if (token) return { redirect: { destination: "/home", permanent: false } };
  return { props: {} };
}
