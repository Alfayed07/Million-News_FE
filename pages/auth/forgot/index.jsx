import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Messages from "../../../components/Messages";

export default function ForgotPage(){
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState({ type:"", text:"" });
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const hasToken = document.cookie.includes("token=");
    if (hasToken) router.replace("/home");
  },[router]);

  return (
    <div className="min-h-screen bg-[#eef0f2] py-6" style={{ fontFamily: 'Newsreader, "Noto Sans", sans-serif' }}>
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border shadow-sm">
        <header className="flex items-center justify-between px-6 md:px-8 py-3 border-b">
          <div className="flex items-center gap-10"><div className="text-lg font-semibold">News Today</div></div>
        </header>
        <div className="px-6 md:px-8 py-10 flex justify-center">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold text-[#111418] mb-4">Forgot password</h1>
            {msg.text ? (<div className="mb-3"><Messages type={msg.type}>{msg.text}</Messages></div>) : null}
            <form className="space-y-4" onSubmit={async (e)=>{
              e.preventDefault(); setMsg({}); setLoading(true);
              try{
                const resp = await fetch('/api/auth/forgot', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email })});
                const data = await resp.json();
                if(!resp.ok) throw new Error(data?.message || 'Failed');
                setMsg({ type:'success', text:'If this email exists, a reset link has been sent.' });
                if (data?.reset_token) setToken(data.reset_token); // dev aid
              }catch(err){ setMsg({ type:'error', text: err.message }); }
              finally{ setLoading(false); }
            }}>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#637588]">Email</label>
                <input type="email" className="border rounded-md px-3 py-2" value={email} onChange={e=> setEmail(e.target.value)} required />
              </div>
              <button disabled={loading} className="inline-flex items-center justify-center rounded-xl h-10 px-4 bg-[#1980e6] text-white text-sm font-medium disabled:opacity-60 w-full">{loading?'Sending...':'Send reset link'}</button>
            </form>
            {token ? (
              <div className="mt-4 text-sm text-[#637588]">
                Dev reset link: <a className="text-[#1980e6] underline" href={`/auth/reset?token=${token}`}>/auth/reset?token={token}</a>
              </div>
            ) : null}
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
