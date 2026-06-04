import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { type Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/types'

interface AdminContextValue {
  session: Session | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session: s } } = await supabase.auth.getSession()
        setSession(s)
        if (s?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', s.user.id)
            .maybeSingle()
          setProfile(data ?? null)
        }
      } catch (_err) {
        setSession(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s)
      if (s?.user) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', s.user.id)
            .maybeSingle()
          setProfile(data ?? null)
        } catch (_err) {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
    })

    return () => { listener.subscription.unsubscribe() }
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (_err) {
      // ignore
    }
  }

  return (
    <AdminContext.Provider value={{ session, profile, loading, signOut }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdminContext(): AdminContextValue {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdminContext must be used inside AdminProvider')
  return ctx
}
