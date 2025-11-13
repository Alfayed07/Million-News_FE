import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, forwardRef } from "react";
import NewsCard from "../../components/NewsCard";
import TopStoriesSlider from "../../components/TopStoriesSlider";
import { Pagination } from "rsuite";
import { fetchTopStories, fetchCategory, fetchTrending, fetchSearch, fetchCategoryPaged, fetchSearchPaged } from "../../lib/news";
import { timeAgoID } from "../../lib/formatDate";
import { fetchCategories } from "../../lib/categories";
import { useRouter } from "next/router";

// Reusable image with default fallback for featured sections (defined outside render)
const FeaturedImg = ({ src, alt }) => {
  const [error, setError] = useState(false);
  const safe = !src || error ? "/news-placeholder.svg" : src;
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden w-full">
      <Image
        src={safe}
        alt={alt || "image"}
        fill
        unoptimized
        onError={() => setError(true)}
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
};

export default function Home({
  topStories = [],
  national = [],
  international = [],
  sports = [],
  entertainment = [],
  technology = [],
  trending = [],
  initialQuery = "",
  searchResults = [],
  profile = null,
  categories = [],
  selectedCategory = "",
  categoryItems = [],
  // pagination meta
  searchTotal = 0,
  searchPage = 1,
  searchLimit = 10,
  categoryTotal = 0,
  categoryPage = 1,
  categoryLimit = 10,
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  // We now show Top Stories as a slider; fetch provides more items, rendered in pages of up to 6
  const pick = (arr) => (Array.isArray(arr) && arr.length > 0 ? arr[0] : null);
  const nat = pick(national);
  const intl = pick(international);
  const spr = pick(sports);
  const ent = pick(entertainment);
  const tech = pick(technology);

  // RSuite Pagination link component to work with Next.js routing
  const NavLink = forwardRef(({ href, active, eventKey, as, children, ...rest }, ref) => {
    const q = { ...router.query, page: eventKey };
    const linkHref = { pathname: "/home", query: q };
    return (
      <Link ref={ref} href={linkHref} className={active ? "active" : undefined} {...rest}>
        {children ?? eventKey}
      </Link>
    );
  });
  NavLink.displayName = "NavLink";

  // NavLink component remains inside since it depends on router hook

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Newsreader, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-[#111418]">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_319)">
                    <path
                      d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                      fill="currentColor"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_6_319"><rect width="48" height="48" fill="white"></rect></clipPath>
                  </defs>
                </svg>
              </div>
              <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Milion News</h2>
            </div>
            <div className="flex items-center gap-6">
              <Link className="text-[#111418] text-sm font-medium leading-normal hover:underline" href="/home">Home</Link>
              {categories.slice(0, 6).map((c) => (
                <Link
                  key={c.id}
                  className={`text-sm font-medium leading-normal ${selectedCategory?.toLowerCase() === String(c.name).toLowerCase() ? "text-[#1980e6]" : "text-[#111418]"} hover:underline`}
                  href={{ pathname: "/home", query: { category: c.name } }}
                >
                  {String(c.name).charAt(0).toUpperCase() + String(c.name).slice(1)}
                </Link>
              ))}
              {profile?.role && ["admin","editor"].includes(profile.role) && (
                <Link className="text-[#1980e6] text-sm font-semibold leading-normal hover:underline" href="/admin/news">
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <form
              className="flex flex-col min-w-40 h-10 max-w-64"
              onSubmit={(e) => {
                e.preventDefault();
                const q = query?.trim();
                router.push({ pathname: "/home", query: q ? { q } : {} });
              }}
            >
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div
                  className="text-[#637588] flex border-none bg-[#f0f2f4] items-center justify-center pl-4 rounded-l-xl border-r-0"
                  data-icon="MagnifyingGlass"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-full placeholder:text-[#637588] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f0f2f4] text-[#111418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <div className="text-[#111418]" data-icon="Bell" data-size="20px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"
                  ></path>
                </svg>
              </div>
            </button>
            <Link href="/profil" aria-label="Go to profile">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{ backgroundImage: `url("${profile?.avatar || "/default-avatar.svg"}")` }}
                title={profile?.username || profile?.name || "Profile"}
              ></div>
            </Link>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:px-4 @[480px]:py-3">
                <div
                  className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-white @[480px]:rounded-xl min-h-[218px]"
                  style={{ backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("https://picsum.photos/seed/hero-news/1200/400")' }}
                >
                  <div className="flex justify-center gap-2 p-5">
                    <div className="size-1.5 rounded-full bg-white"></div>
                    <div className="size-1.5 rounded-full bg-white opacity-50"></div>
                    <div className="size-1.5 rounded-full bg-white opacity-50"></div>
                    <div className="size-1.5 rounded-full bg-white opacity-50"></div>
                    <div className="size-1.5 rounded-full bg-white opacity-50"></div>
                  </div>
                </div>
              </div>
            </div>
            {initialQuery ? (
              <>
                <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Search results for “{initialQuery}”</h2>
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <NewsCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      image={item.image}
                      createdAt={item.created_at}
                      publishedAt={item.published_at}
                      href={`/berita/${encodeURIComponent(item.id)}`}
                    />
                  ))
                ) : (
                  <div className="px-4 text-[#637588]">No results found.</div>
                )}
                <div className="flex justify-center">
                  <Pagination
                    layout={["total", "-", "limit", "|", "pager", "skip"]}
                    limitOptions={[10, 20, 50]}
                    prev
                    next
                    first
                    last
                    linkAs={NavLink}
                    total={searchTotal}
                    limit={searchLimit}
                    activePage={searchPage}
                    onChangeLimit={(l) => {
                      const q = { ...router.query, q: initialQuery, page: 1, limit: l };
                      router.push({ pathname: "/home", query: q });
                    }}
                  />
                </div>
              </>
            ) : selectedCategory ? (
              <>
                <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Category: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                </h2>
                {categoryItems && categoryItems.length > 0 ? (
                  categoryItems.map((item) => (
                    <NewsCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      image={item.image}
                      createdAt={item.created_at}
                      publishedAt={item.published_at}
                      href={`/berita/${encodeURIComponent(item.id)}`}
                    />
                  ))
                ) : (
                  <div className="px-4 text-[#637588]">No articles in this category.</div>
                )}
                <div className="flex justify-center">
                  <Pagination
                    layout={["total", "-", "limit", "|", "pager", "skip"]}
                    limitOptions={[10, 20, 50]}
                    prev
                    next
                    first
                    last
                    linkAs={NavLink}
                    total={categoryTotal}
                    limit={categoryLimit}
                    activePage={categoryPage}
                    onChangeLimit={(l) => {
                      const q = { ...router.query, category: selectedCategory, page: 1, limit: l };
                      router.push({ pathname: "/home", query: q });
                    }}
                  />
                </div>
              </>
            ) : (
              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Top Stories</h2>
            )}
            {!selectedCategory && !initialQuery && (
              topStories && topStories.length > 0 ? (
                <TopStoriesSlider items={topStories} perPage={6} />
              ) : (
                <>
                  <NewsCard
                    title="Government Announces New Economic Plan to Boost Job Growth"
                    description="lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    image="https://cdn.usegalileo.ai/sdxl10/c211285b-0fdc-46ee-9467-9471799200dd.png"
                    href="/berita/1"
                  />
                  <NewsCard
                    title="Tech Giant Unveils Latest Smartphone Model with Advanced Features"
                    description="lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    image="https://cdn.usegalileo.ai/sdxl10/5adb2e21-9930-44df-b4ec-db97de1aabce.png"
                    href="/berita/2"
                  />
                </>
              )
            )}
            {!selectedCategory && !initialQuery && (
            <>
            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">National News</h2>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-xl">
                <div className="flex flex-[2_2_0px] flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[#111418] text-base font-bold leading-tight">
                      <a className="hover:underline" href={nat?.id ? `/berita/${encodeURIComponent(nat.id)}` : "#"}>
                        {nat?.title || "Major Infrastructure Project Commences in Urban Area"}
                      </a>
                    </p>
                    {nat && (nat.published_at || nat.created_at) && (
                      <p className="text-[#637588] text-sm leading-normal">{timeAgoID(nat.published_at || nat.created_at)}</p>
                    )}
                    <p className="text-[#637588] text-sm font-normal leading-normal">{nat?.description || "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}</p>
                  </div>
                  <a
                    className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-fit"
                    href={nat?.id ? `/berita/${encodeURIComponent(nat.id)}` : "#"}
                  >
                    <span className="truncate">Read More</span>
                  </a>
                </div>
                {nat?.id ? (
                  <Link href={`/berita/${encodeURIComponent(nat.id)}`} className="w-full flex-1">
                    <FeaturedImg src={nat?.image} alt={nat?.title} />
                  </Link>
                ) : (
                  <div className="w-full flex-1">
                    <FeaturedImg src={nat?.image} alt={nat?.title} />
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">International News</h2>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-xl">
                <div className="flex flex-[2_2_0px] flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[#111418] text-base font-bold leading-tight">
                      <a className="hover:underline" href={intl?.id ? `/berita/${encodeURIComponent(intl.id)}` : "#"}>
                        {intl?.title || "Global Leaders Gather for Climate Change Summit"}
                      </a>
                    </p>
                    {intl && (intl.published_at || intl.created_at) && (
                      <p className="text-[#637588] text-sm leading-normal">{timeAgoID(intl.published_at || intl.created_at)}</p>
                    )}
                    <p className="text-[#637588] text-sm font-normal leading-normal">{intl?.description || "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}</p>
                  </div>
                  <a
                    className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-fit"
                    href={intl?.id ? `/berita/${encodeURIComponent(intl.id)}` : "#"}
                  >
                    <span className="truncate">Read More</span>
                  </a>
                </div>
                {intl?.id ? (
                  <Link href={`/berita/${encodeURIComponent(intl.id)}`} className="w-full flex-1">
                    <FeaturedImg src={intl?.image} alt={intl?.title} />
                  </Link>
                ) : (
                  <div className="w-full flex-1">
                    <FeaturedImg src={intl?.image} alt={intl?.title} />
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Sports</h2>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-xl">
                <div className="flex flex-[2_2_0px] flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[#111418] text-base font-bold leading-tight">
                      <a className="hover:underline" href={spr?.id ? `/berita/${encodeURIComponent(spr.id)}` : "#"}>
                        {spr?.title || "Local Team Advances to Championship Final After Thrilling Match"}
                      </a>
                    </p>
                    {spr && (spr.published_at || spr.created_at) && (
                      <p className="text-[#637588] text-sm leading-normal">{timeAgoID(spr.published_at || spr.created_at)}</p>
                    )}
                    <p className="text-[#637588] text-sm font-normal leading-normal">{spr?.description || "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}</p>
                  </div>
                  <a
                    className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-fit"
                    href={spr?.id ? `/berita/${encodeURIComponent(spr.id)}` : "#"}
                  >
                    <span className="truncate">Read More</span>
                  </a>
                </div>
                {spr?.id ? (
                  <Link href={`/berita/${encodeURIComponent(spr.id)}`} className="w-full flex-1">
                    <FeaturedImg src={spr?.image} alt={spr?.title} />
                  </Link>
                ) : (
                  <div className="w-full flex-1">
                    <FeaturedImg src={spr?.image} alt={spr?.title} />
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Entertainment</h2>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-xl">
                <div className="flex flex-[2_2_0px] flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[#111418] text-base font-bold leading-tight">
                      <a className="hover:underline" href={ent?.id ? `/berita/${encodeURIComponent(ent.id)}` : "#"}>
                        {ent?.title || "Critically Acclaimed Film Wins Multiple Awards at Prestigious Ceremony"}
                      </a>
                    </p>
                    {ent && (ent.published_at || ent.created_at) && (
                      <p className="text-[#637588] text-sm leading-normal">{timeAgoID(ent.published_at || ent.created_at)}</p>
                    )}
                    <p className="text-[#637588] text-sm font-normal leading-normal">{ent?.description || "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}</p>
                  </div>
                  <a
                    className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-fit"
                    href={ent?.id ? `/berita/${encodeURIComponent(ent.id)}` : "#"}
                  >
                    <span className="truncate">Read More</span>
                  </a>
                </div>
                {ent?.id ? (
                  <Link href={`/berita/${encodeURIComponent(ent.id)}`} className="w-full flex-1">
                    <FeaturedImg src={ent?.image} alt={ent?.title} />
                  </Link>
                ) : (
                  <div className="w-full flex-1">
                    <FeaturedImg src={ent?.image} alt={ent?.title} />
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Technology</h2>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-xl">
                <div className="flex flex-[2_2_0px] flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[#111418] text-base font-bold leading-tight">
                      <a className="hover:underline" href={tech?.id ? `/berita/${encodeURIComponent(tech.id)}` : "#"}>
                        {tech?.title || "Breakthrough in Artificial Intelligence Research Leads to New Possibilities"}
                      </a>
                    </p>
                    {tech && (tech.published_at || tech.created_at) && (
                      <p className="text-[#637588] text-sm leading-normal">{timeAgoID(tech.published_at || tech.created_at)}</p>
                    )}
                    <p className="text-[#637588] text-sm font-normal leading-normal">{tech?.description || "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}</p>
                  </div>
                  <a
                    className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-fit"
                    href={tech?.id ? `/berita/${encodeURIComponent(tech.id)}` : "#"}
                  >
                    <span className="truncate">Read More</span>
                  </a>
                </div>
                {tech?.id ? (
                  <Link href={`/berita/${encodeURIComponent(tech.id)}`} className="w-full flex-1">
                    <FeaturedImg src={tech?.image} alt={tech?.title} />
                  </Link>
                ) : (
                  <div className="w-full flex-1">
                    <FeaturedImg src={tech?.image} alt={tech?.title} />
                  </div>
                )}
              </div>
            </div>
            </>
            )}

            {/* Trending Section */}
            <div className="px-4 py-8 border-t border-solid border-[#f0f2f4]">
              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">Trending</h2>
              <div className="flex flex-col gap-4">
                {trending && trending.length > 0 ? (
                  trending.slice(0, 5).map((item) => (
                    <Link key={item.id}
                      href={`/berita/${encodeURIComponent(item.id)}`}
                      className="flex items-center gap-4 p-3 hover:bg-[#f0f2f4] rounded-xl transition-colors"
                    >
                      <div className="size-3 rounded-full bg-[#1980e6]"></div>
                      <p className="text-[#111418] text-base font-medium leading-tight">{item.title}</p>
                    </Link>
                  ))
                ) : (
                  [
                    { id: "t1", title: "New Environmental Regulations" },
                    { id: "t2", title: "Summer Travel Safety Tips" },
                    { id: "t3", title: "Stock Market Update" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#f8fafc]">
                      <div className="size-3 rounded-full bg-[#1980e6]"></div>
                      <p className="text-[#111418] text-base font-medium leading-tight">{item.title}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-40 py-6 border-t border-solid border-[#f0f2f4] bg-[#f8f9fa]">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4 text-[#111418]">
                <div className="size-4">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_6_319)">
                      <path
                        d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                </div>
                <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Milion News</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111418] text-sm font-bold leading-normal">Company</h3>
                  <a href="#" className="text-[#637588] text-sm font-normal leading-normal hover:text-[#1980e6]">About Us</a>
                  <a href="#" className="text-[#637588] text-sm font-normal leading-normal hover:text-[#1980e6]">Careers</a>
                  <a href="#" className="text-[#637588] text-sm font-normal leading-normal hover:text-[#1980e6]">Contact</a>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111418] text-sm font-bold leading-normal">Legal</h3>
                  <a href="#" className="text-[#637588] text-sm font-normal leading-normal hover:text-[#1980e6]">Terms</a>
                  <a href="#" className="text-[#637588] text-sm font-normal leading-normal hover:text-[#1980e6]">Privacy</a>
                  <a href="#" className="text-[#637588] text-sm font-normal leading-normal hover:text-[#1980e6]">Cookies</a>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111418] text-sm font-bold leading-normal">Follow Us</h3>
                  <div className="flex gap-3">
                    <a href="#" className="text-[#637588] hover:text-[#1980e6]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-[#637588] hover:text-[#1980e6]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                      </svg>
                    </a>
                    <a href="#" className="text-[#637588] hover:text-[#1980e6]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-solid border-[#e1e4e8]">
              <p className="text-[#637588] text-sm font-normal leading-normal text-center">
                © {new Date().getFullYear()} Milion News. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const q = ctx?.query?.q || "";
  const selectedCategory = ctx?.query?.category ? String(ctx.query.category) : "";
  const page = Number(ctx?.query?.page || 1);
  const limit = Number(ctx?.query?.limit || 10);
  // Optional SSR fetch: current user profile from internal API using cookies
  const req = ctx?.req;
  const cookie = req?.headers?.cookie || "";
  const proto = (req?.headers?.["x-forwarded-proto"] || "http").toString();
  const host = req?.headers?.["x-forwarded-host"] || req?.headers?.host;
  const origin = `${proto}://${host}`;
  let profile = null;
  try {
    const resp = await fetch(`${origin}/api/user/profile`, { headers: { cookie } });
    if (resp.ok) {
      profile = await resp.json();
    }
  } catch {}
  // Fetch categories list
  const categories = await fetchCategories();

  // Fetch content depending on query
  let topStories = [];
  let national = [];
  let international = [];
  let sports = [];
  let entertainment = [];
  let technology = [];
  let trending = [];
  let searchResults = [];
  let categoryItems = [];
  let searchTotal = 0, searchPage = page, searchLimit = limit;
  let categoryTotal = 0, categoryPage = page, categoryLimit = limit;

  if (q) {
    // For search view, only need search results and trending
    topStories = [];
    const [tres, sres] = await Promise.all([
      fetchTrending(),
      fetchSearchPaged(q, page, limit),
    ]);
    trending = tres;
    searchResults = sres.items;
    searchTotal = sres.total;
    searchPage = sres.page;
    searchLimit = sres.limit;
  } else if (selectedCategory) {
    // For category view, we only need category items and trending
    topStories = [];
    const [tres, cres] = await Promise.all([
      fetchTrending(),
      fetchCategoryPaged(selectedCategory, page, limit),
    ]);
    trending = tres;
    categoryItems = cres.items;
    categoryTotal = cres.total;
    categoryPage = cres.page;
    categoryLimit = cres.limit;
  } else {
    [topStories, national, international, sports, entertainment, technology, trending] = await Promise.all([
      fetchTopStories(24),
      fetchCategory("national"),
      fetchCategory("international"),
      fetchCategory("sports"),
      fetchCategory("entertainment"),
      fetchCategory("technology"),
      fetchTrending(),
    ]);
  }

  return {
    props: {
      topStories,
      national,
      international,
      sports,
      entertainment,
      technology,
      trending,
      initialQuery: q,
      searchResults,
      profile,
      categories,
      selectedCategory,
      categoryItems,
      // pagination
      searchTotal,
      searchPage,
      searchLimit,
      categoryTotal,
      categoryPage,
      categoryLimit,
    },
  };
}