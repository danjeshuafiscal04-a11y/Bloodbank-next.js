'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Droplet } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    age: '',
    blood_type: '',
    weight: '',
    phone: '',
    last_donation_at: '',
    address: '',
    medical_notes: ''
  })
  
  const [medicalFlags, setMedicalFlags] = useState<string[]>([])
  const [certify, setCertify] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
  const medicalOptions = ['Diabetes', 'Hypertension', 'Recent Surgery', 'Allergies', 'Anemia', 'Infectious Disease']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleMedicalFlag = (option: string) => {
    setMedicalFlags(prev => 
      prev.includes(option) ? prev.filter(f => f !== option) : [...prev, option]
    )
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }
    if (!certify) {
      setError("You must certify that the information is true.")
      setLoading(false)
      return
    }
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            phone: formData.phone || null,
            address: formData.address || null,
            blood_type: formData.blood_type || null,
            weight: formData.weight || null,
            age: formData.age || null,
            last_donation_date: formData.last_donation_at || null,
            other_medical_details: formData.medical_notes || null,
            medical_history: medicalFlags
          }
        }
      })

      if (authError) throw authError

      router.push('/login?portal=donor&registered=true')
    } catch (err: any) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="registration-page">
      <header className="registration-topbar">
        <Link className="registration-brand" href="/">
          <Droplet className="w-6 h-6" />
          <span>RedCross Blood Bank</span>
        </Link>
        <Link className="registration-back" href="/login">
          Back Home
        </Link>
      </header>

      <section className="registration-hero">
        <h1>Donor Registration</h1>
        <p>Your contribution helps maintain a safe, responsive blood bank network.</p>
      </section>

      <section className="registration-wrap">
        {error && (
          <div className="alert">
            {error}
          </div>
        )}

        <form className="registration-card" onSubmit={handleRegister}>
          <div className="registration-grid">
            <div>
              <label className="label" htmlFor="full_name">Full Name</label>
              <input id="full_name" className="input" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Juan Dela Cruz" required />
            </div>

            <div>
              <label className="label" htmlFor="email">Email Address</label>
              <input id="email" className="input" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="donor@redcross.test" required />
            </div>

            <div>
              <label className="label" htmlFor="password">Create Password</label>
              <input id="password" className="input" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Minimum 8 characters" required minLength={8} />
            </div>

            <div>
              <label className="label" htmlFor="password_confirmation">Confirm Password</label>
              <input id="password_confirmation" className="input" name="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleChange} placeholder="Repeat password" required minLength={8} />
            </div>

            <div>
              <label className="label" htmlFor="age">Age</label>
              <input id="age" className="input" name="age" type="number" min="18" max="120" value={formData.age} onChange={handleChange} placeholder="Minimum 18 years" />
            </div>

            <div>
              <label className="label" htmlFor="blood_type">Blood Type</label>
              <select id="blood_type" className="select" name="blood_type" value={formData.blood_type} onChange={handleChange}>
                <option value="">Select blood type</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="weight">Weight (kg)</label>
              <input id="weight" className="input" name="weight" type="number" min="40" max="250" step="0.1" value={formData.weight} onChange={handleChange} placeholder="Minimum 50kg" />
            </div>

            <div>
              <label className="label" htmlFor="phone">Contact Number</label>
              <input id="phone" className="input" name="phone" value={formData.phone} onChange={handleChange} placeholder="+63 912 345 6789" />
            </div>

            <div>
              <label className="label" htmlFor="last_donation_at">Last Donation Date</label>
              <input id="last_donation_at" className="input" name="last_donation_at" type="date" value={formData.last_donation_at} onChange={handleChange} />
            </div>

            <div className="registration-span">
              <label className="label" htmlFor="address">Residential Address</label>
              <textarea id="address" className="textarea" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your full mailing address"></textarea>
            </div>
          </div>

          <div className="registration-medical">
            <h2>Medical History</h2>
            <p>Check all that apply for safety screening.</p>

            <div className="registration-checks">
              {medicalOptions.map(option => (
                <label key={option}>
                  <input 
                    type="checkbox" 
                    checked={medicalFlags.includes(option)} 
                    onChange={() => handleMedicalFlag(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            <div className="mt-6">
              <label className="label" htmlFor="medical_notes">Other Medical Conditions</label>
              <textarea id="medical_notes" className="textarea" name="medical_notes" value={formData.medical_notes} onChange={handleChange} placeholder="Describe conditions or medications..."></textarea>
            </div>
          </div>

          <label className="registration-cert">
            <input type="checkbox" checked={certify} onChange={(e) => setCertify(e.target.checked)} required />
            <span>I certify that the information provided is true and accurate.</span>
          </label>

          <button disabled={loading} className="btn-primary registration-submit" type="submit">
            {loading ? 'Submitting Registration...' : 'Submit Registration'}
          </button>
        </form>
      </section>
    </main>
  )
}
