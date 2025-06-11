'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    router.push(token ? '/profile' : '/login');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-xl font-medium mb-4">Redirecionando...</p>
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
