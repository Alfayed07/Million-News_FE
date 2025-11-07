import React, { useMemo, useState } from "react";

export default function Pagination({
  total = 0,
  page = 1,
  limit = 10,
  onPageChange = () => {},
  onLimitChange = () => {},
}) {
  const lastPage = useMemo(() => Math.max(1, Math.ceil((total || 0) / (limit || 1))), [total, limit]);
  const [goto, setGoto] = useState("");

  const canPrev = page > 1;
  const canNext = page < lastPage;

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex items-center gap-3 text-sm text-[#111418]">
        <span>Total Rows: {total}</span>
        <div className="w-px h-4 bg-[#e5e7eb]" />
        <label className="flex items-center gap-1">
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2 py-1 rounded-md bg-[#f0f2f4] text-[#111418]"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </label>
        <div className="w-px h-4 bg-[#e5e7eb]" />
        <button
          onClick={() => onPageChange(1)}
          disabled={!canPrev}
          className={`px-2 py-1 rounded-md ${canPrev ? "bg-[#f0f2f4] text-[#111418]" : "bg-[#f8f9fa] text-[#9aa4b2]"}`}
        >«</button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className={`px-2 py-1 rounded-md ${canPrev ? "bg-[#f0f2f4] text-[#111418]" : "bg-[#f8f9fa] text-[#9aa4b2]"}`}
        >‹</button>
        <span className="px-3 py-1 rounded-md bg-white border border-[#d0d7de]">{page}</span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className={`px-2 py-1 rounded-md ${canNext ? "bg-[#f0f2f4] text-[#111418]" : "bg-[#f8f9fa] text-[#9aa4b2]"}`}
        >›</button>
        <button
          onClick={() => onPageChange(lastPage)}
          disabled={!canNext}
          className={`px-2 py-1 rounded-md ${canNext ? "bg-[#f0f2f4] text-[#111418]" : "bg-[#f8f9fa] text-[#9aa4b2]"}`}
        >»</button>
        <span className="ml-2">Go to</span>
        <input
          value={goto}
          onChange={(e) => setGoto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const n = Number(goto);
              if (!Number.isNaN(n) && n >= 1 && n <= lastPage) onPageChange(n);
            }
          }}
          className="w-16 px-2 py-1 rounded-md bg-[#f0f2f4] text-[#111418]"
          placeholder=""
        />
      </div>
    </div>
  );
}
