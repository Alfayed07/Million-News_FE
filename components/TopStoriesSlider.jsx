import React, { useState } from "react";
import { Pagination } from "rsuite";
import NewsCard from "./NewsCard";

export default function TopStoriesSlider({ items = [], perPage = 6, size = "lg" }) {
  const totalItems = Array.isArray(items) ? items.length : 0;
  const lastPage = Math.max(1, Math.ceil((totalItems || 0) / (perPage || 1)));
  const [activePage, setActivePage] = useState(1); // RSuite Pagination is 1-based

  if (!items || items.length === 0) return null;

  const start = (activePage - 1) * perPage;
  const pageItems = items.slice(start, start + perPage);

  return (
    <div className="px-0">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        {pageItems.map((item) => (
          <NewsCard
            key={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
            createdAt={item.created_at}
            publishedAt={item.published_at}
            href={`/berita/${encodeURIComponent(item.id)}`}
          />
        ))}
      </div>

      {lastPage > 1 && (
        <div className="flex justify-center py-4">
          <Pagination
            prev
            last
            next
            first
            size={size}
            total={totalItems}
            limit={perPage}
            activePage={activePage}
            onChangePage={setActivePage}
          />
        </div>
      )}
    </div>
  );
}
