'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { markEmailAsRead } from '../../../services/emailService';
import { Email } from '../../../types/email';
import Layout from '../../../components/Layout';

export default function EmailDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchEmail(parseInt(id as string));
    }
  }, [id]);

  const fetchEmail = async (emailId: number) => {
    try {
      const data = await markEmailAsRead(emailId); // já marca como lido aqui
      setEmail(data);
    } catch (err) {
      setError('Erro ao carregar email');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!email) {
    return (
      <Layout>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          {error || 'Email não encontrado.'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Voltar
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {email.assunto}
            </h2>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div><strong>De:</strong> {email.emailRemetente}</div>
              <div><strong>Para:</strong> {email.emailDestinatario}</div>
              <div><strong>Data:</strong> {email.dataEnvio}</div>
            </div>
          </div>

          <div className="p-6 whitespace-pre-wrap text-gray-900 dark:text-white">
            {email.corpo}
          </div>
        </div>
      </div>
    </Layout>
  );
}
