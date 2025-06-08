'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import { getToken, removeToken } from '../../../utils/auth';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        const res = await api.get('/api/usuarios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usuario = res.data.usuario ?? res.data; // considerando que vem dentro do objeto usuario
        setUser(usuario);
        setNome(usuario.nome);
      } catch {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  const handleUpdate = async () => {
    setMessage(''); // limpa mensagem
    try {
      const token = getToken();
      const res = await api.put('/api/usuarios', { nome, senha }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message || 'Dados atualizados com sucesso!');
    } catch {
      setMessage('Erro ao atualizar.');
    }
  };

  const handleDelete = async () => {
    setMessage('');
    try {
      const token = getToken();
      const res = await api.delete('/api/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message || 'Usuário deletado com sucesso.');
      removeToken();
      router.push('/register');
    } catch {
      setMessage('Erro ao deletar usuário.');
    }
  };

  const handleLogout = async () => {
  setMessage('');
  try {
    const token = getToken();
    const res = await api.post('/api/logout', null, { // <- null pois não envia body
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessage(res.data.message || 'Logout realizado com sucesso.');
    removeToken();
    router.push('/login');
  } catch {
    setMessage('Erro no logout.');
  }
}; 

  if (!user) return <p className="text-center text-white mt-20">Carregando...</p>;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 text-gray-100 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Perfil</h2>
        
        <p className="mb-4"><strong>Email:</strong> {user.email}</p>
        
        <input
          className="w-full mb-4 p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome"
        />
        
        <input
          type="password"
          className="w-full mb-6 p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          placeholder="Nova senha"
        />
        
        {message && (
          <p className="mb-4 text-center text-indigo-400">{message}</p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleUpdate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded py-2 font-semibold"
          >
            Atualizar
          </button>
          <button
            onClick={handleDelete}
            className="w-full bg-red-600 hover:bg-red-700 transition rounded py-2 font-semibold"
          >
            Deletar Conta
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-600 hover:bg-gray-700 transition rounded py-2 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
