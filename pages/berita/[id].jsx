import Link from "next/link";
import { fetchNewsById } from "../../lib/news";

export default function BeritaDetail({ item }) {
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#637588]">Article not found.</div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Newsreader, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-[#111418]">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_319)">
                    <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                  </g>
                </svg>
              </div>
              <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Milion News</h2>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <Link href="/home" className="text-sm text-[#637588] hover:underline">Back to Home</Link>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-6">
          <article className="layout-content-container flex flex-col max-w-[960px] flex-1 gap-4">
            <h1 className="text-[#111418] text-2xl font-bold leading-tight tracking-[-0.015em]">{item.title}</h1>
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
              style={{ backgroundImage: `url("${item.image}")` }}
            />
            <p className="text-[#637588] text-base">{item.description}</p>
            {item.content && (
              <div className="prose max-w-none">
                <p>{item.content}</p>
              </div>
            )}
          </article>
        </div>

        <footer className="px-40 py-6 border-t border-solid border-[#f0f2f4] bg-[#f8f9fa]">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-[#111418]">
                <div className="size-4">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_6_319)">
                      <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                    </g>
                  </svg>
                </div>
                <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Milion News</h2>
              </div>
              <p className="text-[#637588] text-sm">© {new Date().getFullYear()} Milion News. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const item = await fetchNewsById(params?.id);
  return { props: { item: item || null } };
}
