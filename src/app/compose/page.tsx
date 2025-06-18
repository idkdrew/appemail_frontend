'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createDraft, updateDraft, getDraft, sendEmail } from '../../services/emailService';
import { Draft } from '../../types/email';
import Layout from '../../components/Layout';

export default function ComposePage() {
  const [assunto, setAssunto] = useState('');
  const [emailDestinatario, setEmailDestinatario] = useState('');
  const [corpo, setCorpo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [draftId, setDraftId] = useState<number | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const draftParam = searchParams.get('draft');
    if (draftParam) {
      const id = parseInt(draftParam);
      setDraftId(id);
      setIsEditing(true);
      loadDraft(id);
    }
  }, [searchParams]);

  const loadDraft = async (id: number) => {
    try {
      setLoading(true);
      const draft = await getDraft(id);
      setAssunto(draft.assunto);
      setEmailDestinatario(draft.emailDestinatario);
      setCorpo(draft.corpo);
    } catch (err) {
      setError('Erro ao carregar rascunho');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    // For drafts, only require at least one field to be filled
    if (!assunto.trim() && !emailDestinatario.trim() && !corpo.trim()) {
      setError('Pelo menos um campo deve ser preenchido para salvar o rascunho');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (isEditing && draftId) {
        await updateDraft({
          rascunhoId: draftId,
          assunto,
          emailDestinatario,
          corpo,
        });
        setMessage('Rascunho atualizado com sucesso');
      } else {
        const draft = await createDraft({
          assunto,
          emailDestinatario,
          corpo,
        });
        setDraftId(draft.rascunhoId);
        setIsEditing(true);
        setMessage('Rascunho salvo com sucesso');
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Erro ao salvar rascunho');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    // For sending emails, all fields are required
    if (!assunto.trim() || !emailDestinatario.trim() || !corpo.trim()) {
      setError('Todos os campos são obrigatórios para enviar o email');
      return;
    }

    if (!confirm('Tem certeza que deseja enviar este email?')) return;

    try {
      setLoading(true);
      setError('');
      
      await sendEmail({
        assunto,
        emailDestinatario,
        corpo,
      });
      
      setMessage('Email enviado com sucesso');
      setTimeout(() => {
        router.push('/emails');
      }, 2000);
    } catch (err) {
      setError('Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (confirm('Tem certeza que deseja limpar todos os campos?')) {
      setAssunto('');
      setEmailDestinatario('');
      setCorpo('');
      setIsEditing(false);
      setDraftId(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Editar Rascunho' : 'Compor Email'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isEditing ? 'Edite seu rascunho e envie quando estiver pronto' : 'Crie um novo email ou salve como rascunho'}
          </p>
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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Para
              </label>
              <input
                type="email"
                value={emailDestinatario}
                onChange={(e) => setEmailDestinatario(e.target.value)}
                placeholder="destinatario@email.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assunto
              </label>
              <input
                type="text"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                placeholder="Assunto do email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mensagem
              </label>
              <textarea
                value={corpo}
                onChange={(e) => setCorpo(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                disabled={loading}
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSendEmail}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>Enviar</span>
              </button>

              <button
                onClick={handleSaveDraft}
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>{isEditing ? 'Atualizar Rascunho' : 'Salvar Rascunho'}</span>
              </button>

              <button
                onClick={handleClear}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                <span>Limpar</span>
              </button>

              <button
                onClick={() => router.back()}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}