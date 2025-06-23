'use client';

import { useEffect, useState } from 'react';
import { getEmails, markEmailAsRead } from '../../services/emailService';
import { Email } from '../../types/email';
import Layout from '../../components/Layout';
import { useRouter } from 'next/navigation';

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const emailList = await getEmails();
      setEmails(emailList);
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        setError('Erro ao carregar emails');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = (email: Email) => {
    router.push(`/emails/${email.emailId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lido': return 'text-gray-500';
      case 'nao_lido': return 'text-blue-600 font-semibold';
      case 'enviado': return 'text-green-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'lido': return 'Lido';
      case 'nao_lido': return 'Não lido';
      case 'enviado': return 'Enviado';
      default: return status;
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Emails</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {/* Email List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Caixa de Entrada ({emails.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                {emails.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum email encontrado
                  </div>
                ) : (
                  emails.map((email) => (
                    <div
                      key={email.emailId}
                      onClick={() => handleEmailClick(email)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedEmail?.emailId === email.emailId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className={`text-sm truncate ${getStatusColor(email.status)}`}>
                              {email.emailRemetente || email.emailDestinatario}
                            </p>
                          </div>
                          <p className={`text-sm mt-1 truncate ${
                            email.status === 'nao_lido' ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {email.assunto}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {email.dataEnvio}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}