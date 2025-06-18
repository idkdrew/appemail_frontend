'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '../../utils/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    router.push(token ? '/profile' : '/login');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <p className="text-xl font-medium mb-4 text-gray-900 dark:text-white">Redirecionando...</p>
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}