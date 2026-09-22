import { createClient } from '@/lib/supabase/server'
import NotificationsClient from '@/components/admin/NotificationsClient'

export default async function AdminNotificationsPage() {
  const supabase = await createClient()

  // Fetch real notifications for admin
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('target_role', 'admin')
    .order('created_at', { ascending: false })
    .limit(50)

  // Fallback to dummy data matching the user's UI exactly
  const fallback = [
    { 
      id: '1', 
      title: 'O- Donor Match Available', 
      tag: 'Matching Alert',
      body: 'Andrea Reyes is available for urgent O- matching near Santa Rosa.', 
      time_label: '5 mins ago', 
      read_at: null,
      details: { donor_id: '#DN-8842-X', eligibility: 'Verified' }
    },
    { 
      id: '2', 
      title: 'New Donor Registered', 
      tag: 'Registration',
      body: 'Miguel Santos completed donor registration.', 
      time_label: '14 mins ago', 
      read_at: null 
    },
    { 
      id: '3', 
      title: 'A+ Screening Review', 
      tag: 'System Alert',
      body: 'Two A+ donors require temporary deferral review.', 
      time_label: '25 mins ago', 
      read_at: null 
    },
    { 
      id: '4', 
      title: 'AB- Rare Type Found', 
      tag: 'Matching Alert',
      body: 'Nina Aquino is available for rare type scheduling.', 
      time_label: '40 mins ago', 
      read_at: null 
    },
    { 
      id: '5', 
      title: 'Walk-in Donation Logged', 
      tag: 'Registration',
      body: 'Carlo Navarro plasma collection was saved.', 
      time_label: '1 hr ago', 
      read_at: null 
    }
  ]

  const data = notifications && notifications.length > 0 ? notifications : fallback

  return <NotificationsClient initialNotifications={data} />
}
