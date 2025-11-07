export function formatDate(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

// Indonesian relative time, e.g., "38 menit yang lalu"
export function timeAgoID(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (!dateInput || Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const rawSec = Math.floor(diffMs / 1000);
  const isFuture = rawSec < 0;
  const sec = Math.abs(rawSec);
  // Only show "Baru saja" for very recent past events, not future-skewed timestamps
  if (!isFuture && sec < 5) return "Baru saja";
  if (sec < 60) return `${sec} detik yang lalu`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} menit yang lalu`;
  const hr = Math.floor(min / 60);    
  if (hr < 24) return `${hr} jam yang lalu`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} hari yang lalu`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon} bulan yang lalu`;
  const yr = Math.floor(mon / 12);
  return `${yr} tahun yang lalu`;
}
