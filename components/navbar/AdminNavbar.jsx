import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminNavbar({ profile }) {
  const router = useRouter();
  const currentPath = router.pathname;

  // Fungsi untuk menentukan apakah link aktif
  const isActive = (href) => {
    if (href === '/admin/news') {
      // Untuk /admin/news, aktif jika path exact match atau di halaman edit
      return currentPath === '/admin/news' || currentPath.startsWith('/admin/news/edit');
    }
    return currentPath === href;
  };

  // Fungsi untuk mendapatkan className berdasarkan status aktif
  const getLinkClassName = (href) => {
    return isActive(href)
      ? "text-[#1980e6] font-semibold leading-normal hover:underline"
      : "text-[#111418] font-medium leading-normal hover:underline";
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-[#111418]">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_319)">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect width="48" height="48" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">
            Milion News
          </h2>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link className={getLinkClassName('/home')} href="/home">
            Home
          </Link>
          <Link className={getLinkClassName('/admin/news')} href="/admin/news">
            Content
          </Link>
          <Link className={getLinkClassName('/admin/news/create')} href="/admin/news/create">
            Create Content
          </Link>
          <Link className={getLinkClassName('/admin/users')} href="/admin/users">
            Users
          </Link>
        </nav>
      </div>
      {profile && (
        <div className="text-sm text-[#637588]">
          {profile.username} • {profile.role}
        </div>
      )}
    </header>
  );
}
