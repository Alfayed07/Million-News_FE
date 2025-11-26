import React from "react";
import Link from "next/link";
import { timeAgoID } from "../lib/formatDate";
import Image from "next/image";

function Img({ src, alt }) {
  // Build full URL for backend images
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8070';
  let imageSrc = "/news-placeholder.svg";
  
  if (src) {
    // If src starts with /uploads, prepend backend URL
    if (src.startsWith('/uploads/')) {
      imageSrc = backendUrl + src;
    } else if (src.startsWith('http://') || src.startsWith('https://')) {
      // Already a full URL
      imageSrc = src;
    } else {
      // Other relative paths or placeholders
      imageSrc = src;
    }
  }
  
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden w-full">
      <Image
        src={imageSrc}
        alt={alt || "image"}
        fill
        unoptimized
        onError={(e) => {
          const el = e.currentTarget;
          if (el.getAttribute('src') !== '/news-placeholder.svg') {
            el.setAttribute('src', '/news-placeholder.svg');
          }
        }}
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}

export default function NewsCard({ title, description, image, href, actionLabel = "Read More", createdAt, publishedAt }) {
  const when = publishedAt || createdAt;
  const rel = when ? timeAgoID(when) : "";
  return (
    <div className="p-4 @container">
      <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
        {href ? (
          <Link href={href} className="w-full">
            <Img src={image} alt={title} />
          </Link>
        ) : (
          <Img src={image} alt={title} />
        )}
        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
          {href ? (
            <Link href={href} className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] hover:underline">
              {title}
            </Link>
          ) : (
            <p className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">{title}</p>
          )}
          {rel && (
            <p className="text-[#637588] text-sm leading-normal">{rel}</p>
          )}
          <div className="flex items-end gap-3 justify-between">
            <p className="text-[#637588] text-base font-normal leading-normal">{description}</p>
            {href ? (
              <Link
                href={href}
                className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#1980e6] text-white text-sm font-medium leading-normal"
              >
                <span className="truncate">{actionLabel}</span>
              </Link>
            ) : (
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#1980e6] text-white text-sm font-medium leading-normal">
                <span className="truncate">{actionLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
