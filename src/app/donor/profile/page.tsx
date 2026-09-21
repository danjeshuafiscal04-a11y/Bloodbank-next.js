import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const name = profile?.full_name || 'Donor'
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase()

  const saveProfile = async (formData: FormData) => {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('profiles').update({
      full_name: formData.get('full_name'),
      phone: formData.get('phone'),
      blood_type: formData.get('blood_type'),
      address: formData.get('address')
    }).eq('id', user?.id)

    await supabase.from('donors').update({
      full_name: formData.get('full_name'),
      contact: formData.get('phone'),
      blood_type: formData.get('blood_type')
    }).eq('profile_id', user?.id)

    revalidatePath('/donor/profile')
  }

  return (
    <div className="space-y-6">
      <section className="card stagger-1 flex max-w-3xl flex-col gap-6 p-6 sm:flex-row sm:items-center">
        <div className="grid size-24 place-items-center rounded-full bg-red-100 text-2xl font-extrabold text-red-700">
          {initials}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-[-0.03em]">{name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="badge">
              Verified Donor
            </span>
            <span className="badge is-active">
              Blood Type: {profile?.blood_type || 'Unknown'}
            </span>
          </div>
          <p className="mt-3 text-stone-600">Active contributor to Red Cross Blood Bank.</p>
        </div>
      </section>

      <form action={saveProfile} className="card stagger-2 max-w-5xl p-6">
        <h2 className="section-title mb-5">Personal Details</h2>
        <div className="form-grid md:grid-cols-2">
          <div>
            <label className="label">Full Name</label>
            <input className="input" name="full_name" defaultValue={name} required />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input className="input" name="phone" defaultValue={profile?.phone || ''} />
          </div>
          <div>
            <label className="label">Blood Type</label>
            <select className="select" name="blood_type" defaultValue={profile?.blood_type || ''}>
              {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Residential Address</label>
            <input className="input" name="address" defaultValue={profile?.address || ''} />
          </div>
        </div>
        <button className="btn-primary mt-6 transition-transform hover:scale-105 shadow-md" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  )
}
