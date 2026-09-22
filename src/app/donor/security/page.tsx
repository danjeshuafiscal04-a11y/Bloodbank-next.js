'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lock } from 'lucide-react'

export default function SecurityPage() {
  const supabase = createClient()
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    new_password: '',
    new_password_confirmation: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    if (formData.new_password !== formData.new_password_confirmation) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.new_password
      })

      if (error) throw error
      
      setMessage("Password updated successfully.")
      setShowPasswordReset(false)
      setFormData({ new_password: '', new_password_confirmation: '' })
    } catch(err: any) {
      setError("Failed to update password: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card max-w-4xl p-6 stagger-1">
      <h2 className="section-title mb-5">Account Security</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md border border-green-200 text-sm font-semibold stagger-2">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm font-semibold stagger-2">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50 p-5 stagger-2 transition-transform hover:-translate-y-1 hover:shadow-sm">
          <div className="flex items-center gap-3">
            <Lock className="text-stone-500" size={24} />
            <div>
              <p className="font-bold text-stone-900">Password</p>
              <p className="text-sm text-stone-600">Ensure your account is using a long, random password.</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowPasswordReset(!showPasswordReset)}
            className="btn-secondary shrink-0"
          >
            {showPasswordReset ? 'Cancel' : 'Reset Password'}
          </button>
        </div>

        {showPasswordReset && (
          <form onSubmit={handlePasswordUpdate} className="rounded-xl border border-stone-200 bg-stone-50 p-5 space-y-4 stagger-3">
            <div className="form-grid md:grid-cols-2">
              <div>
                <label className="label" htmlFor="new_password">New Password</label>
                <input 
                  id="new_password" 
                  className="input" 
                  name="new_password" 
                  type="password" 
                  autoComplete="new-password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="label" htmlFor="new_password_confirmation">Confirm Password</label>
                <input 
                  id="new_password_confirmation" 
                  className="input" 
                  name="new_password_confirmation" 
                  type="password" 
                  autoComplete="new-password"
                  value={formData.new_password_confirmation}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>
            </div>
            <button 
              disabled={loading}
              className="btn-primary mt-4" 
              type="submit"
            >
              {loading ? 'Saving...' : 'Save New Password'}
            </button>
          </form>
        )}

        <label className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50 p-5 cursor-pointer stagger-3 transition-transform hover:-translate-y-1 hover:shadow-sm">
          <div className="flex items-center gap-3">
            <Lock className="text-stone-500" size={24} />
            <div>
              <p className="font-bold text-stone-900">Two-Factor Authentication</p>
              <p className="text-sm text-stone-600">Secure your account with 2FA (Coming soon)</p>
            </div>
          </div>
          <input className="h-5 w-5 rounded border-stone-300 text-red-700 mt-2 sm:mt-0" type="checkbox" name="two_factor_enabled" disabled />
        </label>
      </div>
    </div>
  )
}
