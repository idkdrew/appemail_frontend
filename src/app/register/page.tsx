'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../../services/api'

export default function RegisterPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/api/usuarios', { nome, email, senha })
      router.push('/login')
    } catch {
      setErro('Erro ao cadastrar usuário. Tente novamente.')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">Cadastro</h1>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Nome
            </label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="******"
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Cadastrar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Faça login
          </a>
        </p>
      </div>
    </main>
  )
}
