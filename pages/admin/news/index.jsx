import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Pagination, Table, Button, Stack, IconButton, Input } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import EditIcon from '@rsuite/icons/Edit';
import SendIcon from '@rsuite/icons/Send';
import { fetchProfile } from '../../../lib/profile';
import AdminNavbar from '../../../components/navbar/AdminNavbar';

const StatusBadge = ({ status }) => {
  const label = (status || '').toLowerCase();
  const tone = label === 'published' ? 'bg-green-100 text-green-800' : label === 'archived' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-800';
  const text = label ? label.charAt(0).toUpperCase() + label.slice(1) : 'Draft';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tone}`}>{text}</span>;
};

const matchesSearchTerm = (row, term) => {
  if (!term) return true;
  const fieldValues = [
    row?.title,
    row?.category,
    row?.author_name,
    row?.status,
    row?.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : '',
    row?.published_at ? new Date(row.published_at).toISOString().slice(0, 10) : '',
  ];
  return fieldValues
    .filter(Boolean)
    .map(value => String(value).toLowerCase())
    .join(' ')
    .includes(term);
};

export default function AdminNews({ profile, drafts, mine, pageDrafts, pageMine, tab }) {
  const router = useRouter();
  const activeTab = tab || 'drafts';
  // RSuite Pagination handlers
  const handlePageChange = (page) => {
    const q = { ...router.query };
    if (activeTab === 'mine') {
      q.pageMine = page; q.tab = 'mine';
    } else {
      q.pageDrafts = page; q.tab = 'drafts';
    }
    router.push({ pathname: '/admin/news', query: q });
  };
  async function doAction(action, id) {
    let url = '';
    if (action === 'publish') url = `/api/manage/news/${id}/publish`;
    else if (action === 'archive') url = `/api/manage/news/${id}/archive`;
    else if (action === 'submit') url = `/api/manage/news/${id}/submit`;
    else if (action === 'approve') url = `/api/manage/news/${id}/approve`;
    else if (action === 'reject') {
      const reason = prompt('Alasan penolakan?');
      if (!reason) return;
      const respReject = await fetch(`/api/manage/news/${id}/reject`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });
      if (respReject.ok) location.reload();
      return;
    }
    if (!url) return;
    const resp = await fetch(url, { method: 'POST' });
    if (resp.ok) location.reload();
  }
  const heading = activeTab === 'drafts' ? 'Draft Management Dashboard' : 'Content Management Dashboard';
  const isMine = activeTab === 'mine';
  const [searchTerm, setSearchTerm] = React.useState('');
  const normalizedTerm = searchTerm.trim().toLowerCase();
  const mineRows = (mine?.items || []).filter(n => n.status !== 'draft');
  const draftRows = drafts?.items || [];
  const filteredMine = normalizedTerm ? mineRows.filter(row => matchesSearchTerm(row, normalizedTerm)) : mineRows;
  const filteredDrafts = normalizedTerm ? draftRows.filter(row => matchesSearchTerm(row, normalizedTerm)) : draftRows;
  const hasSearch = Boolean(normalizedTerm);
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white" style={{ fontFamily: 'Newsreader, "Noto Sans", sans-serif' }}>
      <AdminNavbar profile={profile} />

      <main className="flex flex-1 justify-center bg-[#f5f7fb] px-6 py-10 sm:px-12 lg:px-20">
        <div className="layout-content-container flex w-full max-w-6xl flex-1 flex-col">
          <div className="rounded-3xl border border-[#e4e7ec] bg-white shadow-[0px_16px_40px_rgba(17,20,24,0.04)]">
            <div className="flex flex-col gap-5 border-b border-[#e4e7ec] px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a94a6]">News</span>
                  <h3 className="mt-1 text-xl font-semibold text-[#111418]">{heading}</h3>
                  <p className="text-sm text-[#637588]">Monitor, publish, and archive news with a focused workspace.</p>
                </div>
                <Stack spacing={12} alignItems="center">
                  <Input
                    placeholder="Search news..."
                    size="sm"
                    className="w-full sm:w-56"
                    value={searchTerm}
                    onChange={value => setSearchTerm(value)}
                    clearable
                  />
                  {/* <Button as={Link} href="/admin/news/create" appearance="primary" size="sm" startIcon={<PlusIcon />}>
                    Create Draft
                  </Button> */}
                </Stack>
              </div>
              <div className="flex justify-start">
                <Stack direction="row" spacing={12} alignItems="center">
                  <Button
                    appearance={isMine ? 'primary' : 'subtle'}
                    onClick={() => router.push({ pathname: '/admin/news', query: { tab: 'mine' } })}
                    size="sm"
                  >
                    My News
                  </Button>
                  <Button
                    appearance={!isMine ? 'primary' : 'subtle'}
                    onClick={() => router.push({ pathname: '/admin/news', query: { tab: 'drafts' } })}
                    size="sm"
                  >
                    Drafts
                  </Button>
                </Stack>
              </div>
            </div>
            <div className="px-2 pb-6 pt-4 sm:px-5">
              {isMine ? (
                <>
                  <div className="overflow-x-auto rounded-2xl border border-[#f0f2f4]">
                    <Table
                      height={600}
                      rowHeight={84}
                      data={filteredMine}
                      onRowClick={() => {}}
                      rowClassName={() => 'hover:bg-[#fbfcfd]'}
                      headerHeight={44}
                      affixHeader
                    >
                      <Table.Column flexGrow={2} minWidth={320} align="center">
                        <Table.HeaderCell className="text-center">Title</Table.HeaderCell>
                        <Table.Cell>
                          {rowData => (
                            <Link href={`/admin/news/edit/${rowData.id}`} className="hover:underline font-medium text-[#111418] wrap-break-word whitespace-pre-wrap">
                              {rowData.title}
                            </Link>
                          )}
                        </Table.Cell>
                      </Table.Column>

                      <Table.Column width={160} align="center">
                        <Table.HeaderCell>Author</Table.HeaderCell>
                        <Table.Cell>{rowData => rowData.author_name || profile?.username}</Table.Cell>
                      </Table.Column>

                      <Table.Column width={160} align="center">
                        <Table.HeaderCell>Category</Table.HeaderCell>
                        <Table.Cell dataKey="category" />
                      </Table.Column>

                      <Table.Column width={140} align="center">
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.Cell>{rowData => <StatusBadge status={rowData.status} />}</Table.Cell>
                      </Table.Column>

                      <Table.Column width={160} align="center">
                        <Table.HeaderCell>Last Published</Table.HeaderCell>
                        <Table.Cell>
                          {rowData => (rowData.published_at || rowData.created_at) ? new Date(rowData.published_at || rowData.created_at).toISOString().slice(0, 10) : '-'}
                        </Table.Cell>
                      </Table.Column>

                      <Table.Column width={190} align="center" fixed="right">
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.Cell style={{ padding: '6px' }}>
                          {rowData => (
                            <div className="flex items-center justify-center gap-2">
                              <IconButton
                                icon={<EditIcon />}
                                appearance="primary"
                                size="sm"
                                circle
                                title="Edit"
                                onClick={() => router.push(`/admin/news/edit/${rowData.id}`)}
                              />
                              {rowData.status === 'published' && (
                                <IconButton
                                  icon={<SendIcon />}
                                  color="yellow"
                                  appearance="primary"
                                  size="sm"
                                  circle
                                  title="Archive"
                                  onClick={() => doAction('archive', rowData.id)}
                                />
                              )}
                              {rowData.status === 'archived' && (
                                <IconButton
                                  icon={<SendIcon />}
                                  color="green"
                                  appearance="primary"
                                  size="sm"
                                  circle
                                  title="Publish Again"
                                  onClick={() => doAction('publish', rowData.id)}
                                />
                              )}
                            </div>
                          )}
                        </Table.Cell>
                      </Table.Column>
                    </Table>
                    {filteredMine.length === 0 && (
                      <div className="px-6 py-8 text-center text-[#637588]">
                        {hasSearch ? 'No articles match your search.' : 'No published or archived articles yet.'}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Pagination
                      layout={["total", "-", "pager"]}
                      prev
                      next
                      first
                      last
                      total={mine?.total || 0}
                      limit={mine?.limit || 10}
                      activePage={mine?.page || pageMine || 1}
                      onChangePage={handlePageChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-2xl border border-[#f0f2f4]">
                    <Table
                      height={600}
                      rowHeight={84}
                      data={filteredDrafts}
                      onRowClick={() => {}}
                      rowClassName={() => 'hover:bg-[#fbfcfd]'}
                      headerHeight={44}
                      affixHeader
                    >
                      <Table.Column flexGrow={2} minWidth={320} align="left">
                        <Table.HeaderCell className="text-center">Title</Table.HeaderCell>
                        <Table.Cell>
                          {rowData => (
                            <Link href={`/admin/news/edit/${rowData.id}`} className="hover:underline font-medium text-[#111418] wrap-break-word whitespace-pre-wrap">
                              {rowData.title}
                            </Link>
                          )}
                        </Table.Cell>
                      </Table.Column>

                      <Table.Column width={160} align="center">
                        <Table.HeaderCell>Author</Table.HeaderCell>
                        <Table.Cell>{rowData => rowData.author_name || '-'}</Table.Cell>
                      </Table.Column>

                      <Table.Column width={160} align="center">
                        <Table.HeaderCell>Category</Table.HeaderCell>
                        <Table.Cell dataKey="category" />
                      </Table.Column>

                      <Table.Column width={140} align="center">
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.Cell>{rowData => <StatusBadge status={rowData.status} />}</Table.Cell>
                      </Table.Column>

                      <Table.Column width={160} align="center">
                        <Table.HeaderCell>Created</Table.HeaderCell>
                        <Table.Cell>{rowData => rowData.created_at ? new Date(rowData.created_at).toISOString().slice(0, 10) : '-'}</Table.Cell>
                      </Table.Column>

                      <Table.Column width={260} align="center" fixed="right">
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.Cell style={{ padding: '6px' }}>
                          {rowData => (
                            <div className="flex items-center justify-center gap-2">
                              <IconButton
                                icon={<EditIcon />}
                                appearance="primary"
                                size="sm"
                                circle
                                title="Edit"
                                onClick={() => router.push(`/admin/news/edit/${rowData.id}`)}
                              />
                              {/* Draft workflow action buttons */}
                              {profile?.role !== 'editor' && rowData.status === 'draft' && !rowData.needs_approval && (
                                <IconButton
                                  icon={<SendIcon />}
                                  color="violet"
                                  appearance="primary"
                                  size="sm"
                                  circle
                                  title="Submit for Approval"
                                  onClick={() => doAction('submit', rowData.id)}
                                />
                              )}
                              {profile?.role === 'editor' && rowData.status === 'draft' && !rowData.needs_approval && (
                                <IconButton
                                  icon={<SendIcon />}
                                  color="green"
                                  appearance="primary"
                                  size="sm"
                                  circle
                                  title="Publish"
                                  onClick={() => doAction('publish', rowData.id)}
                                />
                              )}
                              {profile?.role === 'editor' && rowData.status === 'draft' && rowData.needs_approval && (
                                <>
                                  <IconButton
                                    icon={<SendIcon />}
                                    color="green"
                                    appearance="primary"
                                    size="sm"
                                    circle
                                    title="Approve & Publish"
                                    onClick={() => doAction('approve', rowData.id)}
                                  />
                                  <IconButton
                                    icon={<SendIcon />}
                                    color="red"
                                    appearance="primary"
                                    size="sm"
                                    circle
                                    title="Reject"
                                    onClick={() => doAction('reject', rowData.id)}
                                  />
                                </>
                              )}
                              {profile?.role !== 'editor' && rowData.status === 'draft' && rowData.needs_approval && (
                                <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">Waiting Approval</span>
                              )}
                            </div>
                          )}
                        </Table.Cell>
                      </Table.Column>
                    </Table>
                    {filteredDrafts.length === 0 && (
                      <div className="px-6 py-8 text-center text-[#637588]">
                        {hasSearch ? 'No drafts match your search.' : 'No drafts.'}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Pagination
                      layout={["total", "-", "pager"]}
                      prev
                      next
                      first
                      last
                      total={drafts?.total || 0}
                      limit={drafts?.limit || 10}
                      activePage={drafts?.page || pageDrafts || 1}
                      onChangePage={handlePageChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="px-40 py-6 border-t border-solid border-[#f0f2f4] bg-[#f8f9fa]">
  <div className="layout-content-container flex flex-col max-w-7xl flex-1">
          <div className="flex items-center gap-4 text-[#111418]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_6_319)"><path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path></g></svg>
            </div>
            <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Milion News</h2>
          </div>
          <div className="mt-4 text-[#637588] text-sm">© {new Date().getFullYear()} Milion News. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const profile = await fetchProfile(ctx);
  if (!profile || !['admin','editor'].includes(profile.role)) {
    return { redirect: { destination: '/home', permanent: false } };
  }
  // ensure a canonical tab param, default to drafts
  if (typeof ctx.query.tab === 'undefined') {
    const search = new URLSearchParams({ tab: 'drafts' });
    if (ctx.query.pageDrafts) search.set('pageDrafts', String(ctx.query.pageDrafts));
    if (ctx.query.pageMine) search.set('pageMine', String(ctx.query.pageMine));
    return { redirect: { destination: `/admin/news?${search.toString()}`, permanent: false } };
  }
  const pageDrafts = Number(ctx.query.pageDrafts || 1);
  const pageMine = Number(ctx.query.pageMine || 1);
  const tab = ctx.query.tab === 'drafts' ? 'drafts' : 'mine';
  const proto = (ctx.req.headers['x-forwarded-proto'] || 'http').toString();
  const host = ctx.req.headers['x-forwarded-host'] || ctx.req.headers.host;
  const origin = `${proto}://${host}`;
  const [resDrafts, resMine] = await Promise.all([
    fetch(`${origin}/api/manage/news/drafts?page=${pageDrafts}&limit=10`, { headers: { cookie: ctx.req.headers.cookie || '' } }),
    fetch(`${origin}/api/manage/news/mine?page=${pageMine}&limit=10`, { headers: { cookie: ctx.req.headers.cookie || '' } }),
  ]);
  const drafts = await resDrafts.json();
  const mine = await resMine.json();
  return { props: { profile, drafts, mine, pageDrafts, pageMine, tab } };
}
