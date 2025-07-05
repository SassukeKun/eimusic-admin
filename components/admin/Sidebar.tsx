import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        <nav>
          <Link href="/admin/content/albums" className="block py-2 hover:bg-gray-700 rounded">
            Álbuns
          </Link>
        </nav>
      </div>
    </div>
  );
}
