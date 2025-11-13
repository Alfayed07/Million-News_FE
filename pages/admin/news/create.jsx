import React, { useState } from 'react';
import Link from 'next/link';
import { fetchProfile } from '../../../lib/profile';
import { fetchCategories } from '../../../lib/adminNews';

export default function CreateNews({ profile, categories }) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); setSubmitting(true); setError("");
    try {
      const resp = await fetch('/api/manage/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: categoryId ? Number(categoryId) : null,
          title, content, image
        })
      });
      if (!resp.ok) throw new Error('Failed to create');
      const data = await resp.json();
      const id = data?.item?.id || data?.id;
      window.location.href = `/admin/news/edit/${id}`;
    } catch (e) { setError(e.message); } finally { setSubmitting(false); }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Draft</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input className="w-full border rounded p-2" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Category</label>
          <select className="w-full border rounded p-2" value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
            <option value="">(None)</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Image path (e.g. /uploads/my.jpg)</label>
          <input className="w-full border rounded p-2 mb-2" value={image} onChange={e=>setImage(e.target.value)} placeholder="/uploads/your-file.jpg" />
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
          <button disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">{submitting ? 'Creating...' : 'Create'}</button>
          <Link href="/admin/news" className="px-4 py-2 bg-gray-200 rounded">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const profile = await fetchProfile(ctx);
  if (!profile || !['admin','editor'].includes(profile.role)) {
    return { redirect: { destination: '/home', permanent: false } };
  }
  const categories = await fetchCategories();
  return { props: { profile, categories } };
}
