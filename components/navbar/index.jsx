import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="flex items-center gap-6 text-sm">
      <Link href="/home" className="hover:underline">Home</Link>
      <Link href="#" className="hover:underline">National</Link>
      <Link href="#" className="hover:underline">International</Link>
      <Link href="#" className="hover:underline">Sports</Link>
      <Link href="#" className="hover:underline">Entertainment</Link>
      <Link href="#" className="hover:underline">Technology</Link>
    </nav>
  );
}
