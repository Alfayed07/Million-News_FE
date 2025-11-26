import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchProfile } from '../../../lib/profile';
import { fetchCategories } from '../../../lib/adminNews';
import AdminNavbar from '../../../components/navbar/AdminNavbar';

export default function CreateNews({ profile, categories }) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8070';
  const imagePreviewUrl = image?.startsWith('/uploads/') ? backendUrl + image : (image || '');

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Process file upload
  const handleFileChange = async (file) => {
    if (!file) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError('File size too large. Maximum 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('File format not supported. Use JPG, PNG, WEBP, or GIF');
      return;
    }

    setUploading(true);
    setError(''); // Clear previous errors
    try {
      const form = new FormData();
      form.append('file', file);
      const resp = await fetch('/api/manage/upload', { method: 'POST', body: form });
      const data = await resp.json();
      if (resp.ok && data?.path) {
        setImage(data.path);
      } else {
        setError(data?.message || 'Upload failed. Please try again.');
      }
    } catch (e) {
      setError('An error occurred during upload: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileChange(file);
      e.target.value = ''; // Reset input for next upload
    }
  }

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
    <>
      <AdminNavbar profile={profile} />
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
          <label className="block text-sm font-medium mb-2">News Image</label>
          
          {/* Upload from Device with Drag & Drop */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-2">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Click to select image</span>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" 
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1 inline">or drag & drop image here</p>
              </div>
              <p className="text-xs text-gray-500">Format: PNG, JPG, WEBP, GIF (Max 10MB)</p>
            </div>
          </div>

          {uploading && (
            <div className="mt-3 flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-sm text-blue-600 font-medium">Uploading image...</p>
            </div>
          )}

          {/* Image Preview */}
          {imagePreviewUrl && !uploading && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Image Preview:</p>
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
              <div className="relative w-full h-64 rounded border border-gray-200 overflow-hidden bg-white">
                <Image 
                  src={imagePreviewUrl} 
                  alt="Preview" 
                  fill 
                  style={{ objectFit: 'contain' }} 
                  unoptimized 
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 truncate">{image}</p>
            </div>
          )}
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
    </>
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
