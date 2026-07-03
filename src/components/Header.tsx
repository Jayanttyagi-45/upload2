'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  const links = [
    { name: 'Upload', href: '/' },
    { name: 'Library', href: '/library' },
    { name: 'Kanban', href: '/kanban' },
    { name: 'Profile', href: '/profile' },
    { name: 'Contact', href: '/form' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-80 transition-opacity">
              Nexus<span className="text-gray-900">Upload</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-indigo-500 hover:border-indigo-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
