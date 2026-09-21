import PortalLayout from '@/components/layout/PortalLayout'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch admin profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('supabase_user_id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    // If not admin, restrict access
    redirect('/donor/dashboard')
  }

  return (
    <PortalLayout title="Admin Portal" portal="admin" profile={profile}>
      {children}
    </PortalLayout>
  )
}
