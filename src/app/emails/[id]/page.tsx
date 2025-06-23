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
      const data = await markEmailAsRead(emailId);
      setEmail(data);
    } catch (err) {
      setError('Erro ao carregar email');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
  try {
    const [day, month, year] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // mês começa em 0

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString; // fallback se algo der errado
  }
};


  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'enviado': { bg: 'bg-green-100', text: 'text-green-800', label: 'Enviado' },
      'lido': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Lido' },
      'nao_lido': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Não Lido' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['lido'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
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

  if (error || !email) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Voltar
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Erro ao carregar email
            </h3>
            <p className="text-red-600">
              {error || 'Email não encontrado.'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          ← Voltar para emails
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Email Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {email.assunto || 'Sem assunto'}
                </h1>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(email.status)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(email.dataEnvio)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Metadata */}
          <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  De:
                </label>
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  {email.emailRemetente}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Para:
                </label>
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  {email.emailDestinatario}
                </p>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="px-6 py-8">
            <div className="prose max-w-none">
              <div className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                {email.corpo || 'Este email não possui conteúdo.'}
              </div>
            </div>
          </div>

          {/* Email Actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Email ID: {email.emailId}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push('/compose')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Compor Novo
                </button>
                <button
                  onClick={() => router.push('/emails')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Ver Todos os Emails
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}