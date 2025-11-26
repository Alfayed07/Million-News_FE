# AdminNavbar Component

A reusable navigation bar component for admin pages with automatic active link highlighting.

## Features

- ✅ Automatic active link highlighting based on current route
- ✅ Displays user profile information (username and role)
- ✅ Consistent branding with Milion News logo
- ✅ Responsive navigation links
- ✅ Works seamlessly with Next.js router

## Usage

```jsx
import AdminNavbar from '../../../components/navbar/AdminNavbar';

export default function YourAdminPage({ profile }) {
  return (
    <>
      <AdminNavbar profile={profile} />
      {/* Your page content */}
    </>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| profile | Object | Yes | User profile object containing `username` and `role` |

### Profile Object Structure

```typescript
{
  username: string;
  role: string; // e.g., "admin", "editor"
}
```

## Navigation Links

The component includes the following navigation items:

1. **Home** - `/home`
2. **Content** - `/admin/news`
3. **Create Content** - `/admin/news/create`
4. **Users** - `/admin/users`

## Active Link Logic

- The active link is determined by matching the current route (`router.pathname`)
- Active links are styled with blue color (`text-[#1980e6]`) and bold font
- Inactive links use dark gray color (`text-[#111418]`)
- The `/admin/news` link is also considered active when on edit pages (`/admin/news/edit/[id]`)

## Implementation

This component is currently used in:
- `/pages/admin/news/index.jsx` - News management dashboard
- `/pages/admin/news/create.jsx` - Create news page
- `/pages/admin/news/edit/[id].jsx` - Edit news page
- `/pages/admin/users/index.jsx` - User management page

## Styling

The component uses Tailwind CSS for styling and maintains consistency with the Million News design system:
- Font family: `Newsreader, "Noto Sans", sans-serif`
- Border color: `#f0f2f4`
- Active link color: `#1980e6`
- Text colors: `#111418` (primary), `#637588` (secondary)
