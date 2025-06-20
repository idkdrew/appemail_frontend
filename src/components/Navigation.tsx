'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { removeToken } from '../../utils/auth';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  const navItems = [
    { href: '/profile', label: 'Perfil' },
    { href: '/emails', label: 'Emails' },
    { href: '/drafts', label: 'Rascunhos' },
    { href: '/compose', label: 'Compor' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/profile" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Projeto Cliente Servidor
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}