'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function BloodRequestPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    patient_name: '',
    hospital_name: '',
    physician_name: '',
    contact_number: '',
    blood_type: 'O+',
    units_needed: 1,
    component_type: 'Whole Blood',
    required_at: '',
    urgency: 'routine',
    diagnosis: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase.from('blood_requests').insert({
        requester_id: user?.id,
        patient_name: formData.patient_name,
        hospital_name: formData.hospital_name,
        physician_name: formData.physician_name || null,
        contact_number: formData.contact_number,
        blood_type: formData.blood_type,
        component_type: formData.component_type,
        units_needed: Number(formData.units_needed),
        required_at: formData.required_at || null,
        urgency: formData.urgency,
        diagnosis: formData.diagnosis || null,
        status: 'pending'
      })

      if (error) throw error
      
      setMessage('Blood request submitted successfully.')
      router.push('/donor/dashboard') // or show success state
    } catch (err: any) {
      setMessage('Failed to submit: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header stagger-1">
        <h2 className="page-title text-3xl font-extrabold text-stone-900 tracking-tight">Blood Request Form</h2>
        <p className="page-subtitle mt-1 max-w-2xl text-base text-stone-600">Initialize clinical blood requirements for medical facilities. Please provide accurate recipient data and medical justification.</p>
      </div>

      {message && (
        <div className="mb-6 rounded-md bg-blue-50 p-4 text-blue-800 font-semibold border border-blue-200 stagger-2">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid split-grid lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="card stagger-2 p-6 transition-all hover:-translate-y-1 hover:shadow-md">
            <h2 className="section-title">Patient Details</h2>
            <div className="form-grid grid gap-4 md:grid-cols-2 mt-4">
              <div>
                <label className="label">Patient Full Name</label>
                <input className="input" name="patient_name" value={formData.patient_name} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Hospital / Medical Center Name</label>
                <input className="input" name="hospital_name" value={formData.hospital_name} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Attending Physician's Name</label>
                <input className="input" name="physician_name" value={formData.physician_name} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Contact Person & Number</label>
                <input className="input" name="contact_number" value={formData.contact_number} onChange={handleChange} required />
              </div>
            </div>
          </section>

          <section className="card stagger-3 p-6 transition-all hover:-translate-y-1 hover:shadow-md">
            <h2 className="section-title">Request Specifications</h2>
            <div className="form-grid grid gap-4 md:grid-cols-2 mt-4">
              <div>
                <label className="label">Blood Type Needed</label>
                <select className="select" name="blood_type" value={formData.blood_type} onChange={handleChange}>
                  {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Units Needed</label>
                <input className="input" name="units_needed" type="number" min="1" value={formData.units_needed} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Component Type</label>
                <select className="select" name="component_type" value={formData.component_type} onChange={handleChange}>
                  <option>Whole Blood</option>
                  <option>Platelets</option>
                  <option>Plasma</option>
                  <option>Red Blood Cells</option>
                </select>
              </div>
              <div>
                <label className="label">Required By Date/Time</label>
                <input className="input" name="required_at" type="datetime-local" value={formData.required_at} onChange={handleChange} />
              </div>
            </div>
            <div className="mt-4">
              <label className="label">Urgency Level</label>
              <select className="select" name="urgency" value={formData.urgency} onChange={handleChange}>
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </section>

          <section className="card stagger-4 p-6 transition-all hover:-translate-y-1 hover:shadow-md">
            <h2 className="section-title mb-4">Medical Information</h2>
            <label className="label">Diagnosis / Reason for Request</label>
            <textarea className="textarea" name="diagnosis" rows={4} value={formData.diagnosis} onChange={handleChange}></textarea>
            
            <div className="mt-4 rounded-xl border-2 border-dashed border-red-100 bg-stone-50 p-8 text-center text-stone-600 transition-colors hover:bg-red-50 cursor-pointer">
              Click to upload or drag and drop<br/><span className="text-xs">PDF, JPG, or DICOM files placeholder</span>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="card stagger-3 p-6 transition-transform hover:-translate-y-1 hover:shadow-md">
            <h3 className="section-title mb-4">Request Summary</h3>
            <p className="label">Priority Status</p>
            <span className="badge">
              Pending Selection
            </span>
            <div className="mt-5 rounded-lg border border-red-100 bg-stone-50 p-4">
              <p className="label">Estimated Fulfillment</p>
              <p className="text-xl font-extrabold text-red-700">--:--</p>
            </div>
            <button disabled={loading} className="btn-primary w-full mt-6 transition-transform hover:scale-105 shadow-md" type="submit">
              {loading ? 'Submitting...' : 'Submit Blood Request'}
            </button>
          </div>

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 text-orange-950 stagger-4 transition-transform hover:-translate-y-1">
            <h4 className="font-bold uppercase tracking-wider text-sm">24/7 Clinical Support</h4>
            <p className="mt-2 text-sm">For urgent bypass or logistic inquiries, contact the Hematology Command Center.</p>
          </div>
        </aside>
      </form>
    </>
  )
}
