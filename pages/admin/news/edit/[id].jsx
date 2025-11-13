import React, { useState } from 'react';
import Link from 'next/link';
import { fetchProfile } from '../../../../lib/profile';
import { fetchCategories } from '../../../../lib/adminNews';

export default function EditNews({ profile, item, categories }) {
  const [title, setTitle] = useState(item?.title || "");
  const [categoryId, setCategoryId] = useState(item?.category_id || "");
  const [content, setContent] = useState(item?.content || "");
  const [image, setImage] = useState(item?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save(e) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const resp = await fetch(`/api/manage/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: categoryId ? Number(categoryId) : null,
          title, content, image
        })
      });
      if (!resp.ok) throw new Error('Failed to save');
      location.reload();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  }

  async function callAction(action) {
    const url = action === 'publish' ? `/api/manage/news/publish?id=${item.id}` : `/api/manage/news/archive?id=${item.id}`;
    const resp = await fetch(url, { method: 'POST' });
    if (resp.ok) {
      // Redirect back to dashboard after action; drafts go to drafts tab
      const toDrafts = action === 'archive' || (item?.status === 'draft' && action === 'publish');
      window.location.href = toDrafts ? '/admin/news?tab=drafts' : '/admin/news?tab=mine';
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input className="w-full border rounded p-2" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Category</label>
          <select className="w-full border rounded p-2" value={categoryId || ''} onChange={e=>setCategoryId(e.target.value)}>
            <option value="">(None)</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Image path</label>
          <input className="w-full border rounded p-2 mb-2" value={image || ''} onChange={e=>setImage(e.target.value)} placeholder="/uploads/your-file.jpg" />
          <input type="file" accept="image/*" onChange={async (e)=>{
            const file = e.target.files?.[0]; if(!file) return;
            const form = new FormData(); form.append('file', file);
            const resp = await fetch('/api/manage/upload', { method:'POST', body: form });
            const data = await resp.json(); if (resp.ok && data?.path) setImage(data.path);
          }} />
        </div>
        <div>
          <label className="block text-sm mb-1">Content</label>
          <textarea className="w-full border rounded p-2 min-h-[200px]" value={content} onChange={e=>setContent(e.target.value)} required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
          <Link href="/admin/news" className="px-4 py-2 bg-gray-200 rounded">Back</Link>
        </div>
      </form>
      <div className="mt-6 flex gap-3">
        <button onClick={()=>callAction('publish')} className="px-4 py-2 bg-green-600 text-white rounded">Publish</button>
        <button onClick={()=>callAction('archive')} className="px-4 py-2 bg-yellow-600 text-white rounded">Archive</button>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const profile = await fetchProfile(ctx);
  if (!profile || !['admin','editor'].includes(profile.role)) {
    return { redirect: { destination: '/home', permanent: false } };
  }
  const id = ctx.params.id;
  const origin = `${ctx.req.headers['x-forwarded-proto'] || 'http'}://${ctx.req.headers['x-forwarded-host'] || ctx.req.headers.host}`;
  const res = await fetch(`${origin}/api/news/${id}`);
  const data = await res.json();
  const item = data?.item || data;
  const categories = await fetchCategories();
  return { props: { profile, item, categories } };
}
