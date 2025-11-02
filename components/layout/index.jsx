import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <div className="font-bold">Milion News</div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t px-6 py-4 text-sm text-gray-500">© {new Date().getFullYear()} Milion News</footer>
    </div>
  );
}
