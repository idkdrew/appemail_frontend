'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDrafts, deleteDraft, sendEmailFromDraft } from '../../services/emailService';
import { Draft } from '../../types/email';
import Layout from '../../components/Layout';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const draftList = await getDrafts();
      setDrafts(draftList);
    } catch (err) {
      setError('Erro ao carregar rascunhos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este rascunho?')) return;
    
    try {
      await deleteDraft(id);
      setDrafts(drafts.filter(draft => draft.rascunhoId !== id));
      setMessage('Rascunho deletado com sucesso');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Erro ao deletar rascunho');
    }
  };

  const handleSend = async (id: number) => {
    if (!confirm('Tem certeza que deseja enviar este email?')) return;
    
    try {
      await sendEmailFromDraft(id);
      setDrafts(drafts.filter(draft => draft.rascunhoId !== id));
      setMessage('Email enviado com sucesso');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Erro ao enviar email');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/compose?draft=${id}`);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rascunhos</h1>
          </div>
          
          <button
            onClick={() => router.push('/compose')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Novo Rascunho
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {drafts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum rascunho encontrado
            </h3>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {drafts.map((draft) => (
              <div key={draft.rascunhoId} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {draft.assunto || 'Sem assunto'}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Para:</strong> {draft.emailDestinatario || 'Não informado'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {draft.corpo ? (
                        <>
                          {draft.corpo.substring(0, 100)}
                          {draft.corpo.length > 100 && '...'}
                        </>
                      ) : (
                        'Sem conteúdo'
                      )}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(draft.rascunhoId)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleSend(draft.rascunhoId)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Enviar
                    </button>
                    <button
                      onClick={() => handleDelete(draft.rascunhoId)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}