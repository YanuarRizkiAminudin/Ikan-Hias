import { useState, type FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAdminContext } from '@/context/AdminContext'
import { APP_NAME } from '@/lib/constants'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'

export default function AdminLogin() {
  const { session, loading: authLoading } = useAdminContext()
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)
  const navigate                  = useNavigate()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (session) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Email dan password wajib diisi.')
      return
    }

    try {
      setLoading(true)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email:    email.trim().toLowerCase(),
        password: password.trim(),
      })
      if (signInError) throw signInError
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes('Invalid login credentials')
          ? 'Email atau password salah.'
          : err instanceof Error ? err.message : 'Login gagal. Coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl" aria-hidden="true">🐠</span>
          <h1 className="text-2xl font-extrabold text-text-dark mt-3">{APP_NAME}</h1>
          <p className="text-gray-500 text-sm mt-1">Panel Admin</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-2xl shadow-sm p-8 space-y-5"
          aria-label="Form login admin"
        >
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@aquashop.id"
            required
            autoComplete="email"
            autoFocus
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="text-sm text-red-500 font-medium" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Masuk
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Hanya untuk administrator {APP_NAME}
        </p>
      </div>
    </div>
  )
}
