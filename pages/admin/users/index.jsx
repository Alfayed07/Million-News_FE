import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Table,
  Input,
  Stack,
  Button,
  SelectPicker,
  Toggle,
  Pagination,
  Tag,
  Message,
  useToaster,
} from "rsuite";
import CheckIcon from "@rsuite/icons/Check";
import CloseIcon from "@rsuite/icons/Close";
import { fetchProfile } from "../../../lib/profile";
import { updateUserAccess } from "../../../lib/adminUsers";

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "User", value: "user" },
];

const formatDate = (value) => {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (err) {
    return "-";
  }
};

const StatusTag = ({ active }) => (
  <Tag color={active ? "green" : "red"}>
    {active ? "Aktif" : "Nonaktif"}
  </Tag>
);

export default function AdminUsers({ profile, initialData, page, limit, search }) {
  const router = useRouter();
  const toaster = useToaster();
  const [searchTerm, setSearchTerm] = React.useState(search || "");
  const [rows, setRows] = React.useState(initialData?.items || []);
  const [updatingMap, setUpdatingMap] = React.useState({});

  React.useEffect(() => {
    setRows(initialData?.items || []);
  }, [initialData]);

  const setUpdating = React.useCallback((id, field, value) => {
    setUpdatingMap((prev) => ({ ...prev, [`${id}:${field}`]: value }));
  }, []);

  const isUpdating = React.useCallback((id, field) => !!updatingMap[`${id}:${field}`], [updatingMap]);

  const showToast = React.useCallback((type, text) => {
    toaster.push(
      <Message showIcon type={type} closable>
        {text}
      </Message>,
      { placement: "topEnd", duration: 3000 }
    );
  }, [toaster]);

  const handleSearch = React.useCallback(() => {
    const query = {};
    if (searchTerm.trim()) query.search = searchTerm.trim();
    query.page = 1;
    router.push({ pathname: "/admin/users", query }, undefined, { scroll: false });
  }, [router, searchTerm]);

  const handlePageChange = React.useCallback((nextPage) => {
    const query = {};
    if ((search || "").trim()) query.search = search.trim();
    query.page = nextPage;
    router.push({ pathname: "/admin/users", query }, undefined, { scroll: false });
  }, [router, search]);

  const handleRoleChange = async (id, role) => {
    if (!role) return;
    setUpdating(id, "role", true);
    try {
      const updated = await updateUserAccess(id, { role });
      setRows((prev) => prev.map((row) => (row.id === id ? { ...row, role: updated.role } : row)));
      showToast("success", "Peran pengguna diperbarui.");
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Gagal memperbarui peran.";
      showToast("error", message);
    } finally {
      setUpdating(id, "role", false);
    }
  };

  const handleActiveToggle = async (id, nextValue) => {
    setUpdating(id, "active", true);
    try {
      const updated = await updateUserAccess(id, { is_active: nextValue });
      setRows((prev) => prev.map((row) => (row.id === id ? { ...row, is_active: updated.is_active } : row)));
      showToast("success", `Status pengguna ${nextValue ? "diaktifkan" : "dinonaktifkan"}.`);
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Gagal memperbarui status.";
      showToast("error", message);
    } finally {
      setUpdating(id, "active", false);
    }
  };

  const currentPage = page || 1;
  const total = initialData?.total || 0;
  const isAdmin = profile?.role?.toLowerCase() === "admin";

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white" style={{ fontFamily: 'Newsreader, "Noto Sans", sans-serif' }}>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-[#111418]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_6_319)"><path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path></g><defs><clipPath id="clip0_6_319"><rect width="48" height="48" fill="white"></rect></clipPath></defs></svg>
            </div>
            <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Milion News • Admin</h2>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link className="text-[#111418] font-medium leading-normal hover:underline" href="/home">Home</Link>
            <Link className="text-[#111418] font-medium leading-normal hover:underline" href="/admin/news">Konten</Link>
            <Link className="text-[#1980e6] font-semibold leading-normal hover:underline" href="/admin/users">Pengguna</Link>
            <Link className="text-[#111418] font-medium leading-normal hover:underline" href="/admin/news/create">Buat Konten</Link>
          </div>
        </div>
        <div className="text-sm text-[#637588]">{profile?.username} • {profile?.role}</div>
      </header>

      <main className="flex flex-1 justify-center bg-[#f5f7fb] px-6 py-10 sm:px-12 lg:px-20">
        <div className="layout-content-container flex w-full max-w-6xl flex-1 flex-col">
          <div className="rounded-3xl border border-[#e4e7ec] bg-white shadow-[0px_16px_40px_rgba(17,20,24,0.04)]">
            <div className="flex flex-col gap-5 border-b border-[#e4e7ec] px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a94a6]">Manajemen Pengguna</span>
                  <h3 className="mt-1 text-xl font-semibold text-[#111418]">Pengaturan Hak Akses</h3>
                  <p className="text-sm text-[#637588]">Kelola peran dan status aktif pengguna secara terpusat.</p>
                </div>
                <Stack spacing={12} alignItems="center">
                  <Input
                    placeholder="Cari pengguna (nama, email, username)..."
                    size="sm"
                    className="w-full sm:w-72"
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value)}
                    onPressEnter={handleSearch}
                    clearable
                  />
                  <Button appearance="primary" size="sm" onClick={handleSearch}>
                    Cari
                  </Button>
                </Stack>
              </div>
            </div>
            <div className="px-2 pb-6 pt-4 sm:px-5">
              <div className="overflow-x-auto rounded-2xl border border-[#f0f2f4]">
                <Table
                  height={600}
                  rowHeight={72}
                  data={rows}
                  rowClassName={() => "hover:bg-[#fbfcfd]"}
                  headerHeight={44}
                  affixHeader
                >
                  <Table.Column flexGrow={2} minWidth={220} align="left">
                    <Table.HeaderCell className="text-center">Pengguna</Table.HeaderCell>
                    <Table.Cell>
                      {(rowData) => (
                        <div className="flex flex-col">
                          <span className="font-medium text-[#111418]">{rowData.name || rowData.username}</span>
                          <span className="text-xs text-[#637588]">@{rowData.username}</span>
                        </div>
                      )}
                    </Table.Cell>
                  </Table.Column>

                  <Table.Column flexGrow={2} minWidth={220} align="center">
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.Cell>{(rowData) => rowData.email}</Table.Cell>
                  </Table.Column>

                  <Table.Column width={160} align="center">
                    <Table.HeaderCell>Peran</Table.HeaderCell>
                    <Table.Cell>
                      {(rowData) => {
                        const disabled = profile?.id === rowData.id || !isAdmin;
                        return (
                          <SelectPicker
                            data={roleOptions}
                            size="xs"
                            cleanable={false}
                            searchable={false}
                            value={rowData.role}
                            onChange={(value) => handleRoleChange(rowData.id, value)}
                            disabled={disabled || isUpdating(rowData.id, "role")}
                            placement="auto"
                            style={{ minWidth: 120 }}
                          />
                        );
                      }}
                    </Table.Cell>
                  </Table.Column>

                  <Table.Column width={150} align="center">
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.Cell>
                      {(rowData) => {
                        const disabled = profile?.id === rowData.id;
                        return (
                          <div className="flex items-center justify-center gap-2">
                            <Toggle
                              size="sm"
                              checked={rowData.is_active}
                              checkedChildren={<CheckIcon />}
                              unCheckedChildren={<CloseIcon />}
                              onChange={(value) => handleActiveToggle(rowData.id, value)}
                              disabled={disabled || isUpdating(rowData.id, "active")}
                              loading={isUpdating(rowData.id, "active")}
                            />
                            <StatusTag active={rowData.is_active} />
                          </div>
                        );
                      }}
                    </Table.Cell>
                  </Table.Column>

                  <Table.Column width={160} align="center">
                    <Table.HeaderCell>Terdaftar</Table.HeaderCell>
                    <Table.Cell>{(rowData) => formatDate(rowData.registered_at)}</Table.Cell>
                  </Table.Column>
                </Table>
                {rows.length === 0 && (
                  <div className="px-6 py-8 text-center text-[#637588]">
                    {search ? "Tidak ada pengguna yang cocok dengan pencarian." : "Belum ada data pengguna."}
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
                  total={total}
                  limit={limit}
                  activePage={currentPage}
                  onChangePage={handlePageChange}
                />
              </div>
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
  if (!profile || profile.role?.toLowerCase() !== "admin") {
    return { redirect: { destination: "/home", permanent: false } };
  }

  const page = Number(ctx.query.page || 1);
  const limit = Number(ctx.query.limit || 10);
  const search = ctx.query.search ? String(ctx.query.search) : "";

  const proto = (ctx.req.headers["x-forwarded-proto"] || "http").toString();
  const host = ctx.req.headers["x-forwarded-host"] || ctx.req.headers.host;
  const origin = `${proto}://${host}`;

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);

  const res = await fetch(`${origin}/api/manage/users?${params.toString()}`, {
    headers: { cookie: ctx.req.headers.cookie || "" },
  });
  if (!res.ok) {
    return {
      props: {
        profile,
        initialData: { items: [], total: 0, page, limit, pages: 0, search },
        page,
        limit,
        search,
      },
    };
  }
  const data = await res.json();

  return {
    props: {
      profile,
      initialData: data,
      page: data?.page || page,
      limit: data?.limit || limit,
      search,
    },
  };
}
