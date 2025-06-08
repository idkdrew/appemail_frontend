'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    router.push(token ? '/profile' : '/login');
  }, []);

  return <p>Redirecionando...</p>;
}
