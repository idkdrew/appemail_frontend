'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../../services/api'
import { saveToken } from '../../../utils/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post('/api/login', { email, senha })
      saveToken(response.data.token)
      router.push('/profile')
    } catch (err) {
      setErro('Email ou senha inválidos')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">Login</h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </main>
  )
}
