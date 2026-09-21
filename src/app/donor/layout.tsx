import PortalLayout from '@/components/layout/PortalLayout'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DonorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch donor profile for the sidebar
  const { data: profile } = await supabase
    .from('donors')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  return (
    <PortalLayout title="Donor Portal" portal="donor" profile={profile}>
      {children}
    </PortalLayout>
  )
}
