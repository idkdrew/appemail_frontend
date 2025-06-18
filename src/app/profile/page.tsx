'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import { getToken, removeToken } from '../../../utils/auth';
import Layout from '../../components/Layout';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        const res = await api.get('/api/usuarios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usuario = res.data.usuario ?? res.data;
        setUser(usuario);
        setNome(usuario.nome);
      } catch {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  const handleUpdate = async () => {
    setMessage('');
    setLoading(true);
    try {
      const token = getToken();
      const res = await api.put('/api/usuarios', { nome, senha }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message || 'Dados atualizados com sucesso!');
      setSenha(''); // Clear password field after successful update
    } catch {
      setMessage('Erro ao atualizar.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) return;
    
    setMessage('');
    setLoading(true);
    try {
      const token = getToken();
      const res = await api.delete('/api/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message || 'Usuário deletado com sucesso.');
      removeToken();
      setTimeout(() => router.push('/register'), 2000);
    } catch {
      setMessage('Erro ao deletar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setMessage('');
    setLoading(true);
    try {
      const token = getToken();
      await api.post('/api/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Logout realizado com sucesso.');
      removeToken();
      setTimeout(() => router.push('/login'), 1000);
    } catch {
      setMessage('Erro no logout.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Perfil</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie suas informações pessoais e configurações da conta
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.nome?.charAt(0).toUpperCase() || '👤'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user.nome}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite uma nova senha (opcional)"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Deixe em branco para manter a senha atual
                </p>
              </div>

              {message && (
                <div className={`px-4 py-3 rounded ${
                  message.includes('sucesso') 
                    ? 'bg-green-100 border border-green-400 text-green-700'
                    : 'bg-red-100 border border-red-400 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>💾</span>
                  )}
                  <span>Atualizar Perfil</span>
                </button>

                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>🗑️</span>
                  )}
                  <span>Deletar Conta</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}