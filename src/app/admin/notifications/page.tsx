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

  // Fallback to dummy data if DB has none, just so the UI isn't totally empty while testing
  const fallback = [
    { id: '1', title: 'Urgent Request Match', body: 'Hospital A is urgently requesting 5 units of O- blood. Please review the request queue.', time_label: 'Just now', read_at: null },
    { id: '2', title: 'Low Inventory Alert', body: 'O+ stock is below critical threshold.', time_label: '2 hours ago', read_at: null },
    { id: '3', title: 'New Donor Campaign', body: 'Summer Drive campaign has ended. 200+ units collected.', time_label: 'Yesterday', read_at: new Date().toISOString() },
  ]

  const data = notifications && notifications.length > 0 ? notifications : fallback

  return <NotificationsClient initialNotifications={data} />
}
