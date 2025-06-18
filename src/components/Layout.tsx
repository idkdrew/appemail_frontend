'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken } from '../../utils/auth';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/login', '/register'];

  useEffect(() => {
    const token = getToken();
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!token && !isPublicRoute) {
      router.push('/login');
    } else if (token && isPublicRoute) {
      router.push('/profile');
    } else {
      setIsAuthenticated(!!token);
    }
    
    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-medium mb-4">Carregando...</p>
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isAuthenticated && !isPublicRoute && <Navigation />}
      <main className={isAuthenticated && !isPublicRoute ? 'pt-0' : ''}>
        {children}
      </main>
    </div>
  );
}