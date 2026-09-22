'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    title: 'Save Lives Today',
    text: 'Every donation can save up to three lives. Your contribution makes a direct impact in your community.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX95p7cBihcJwMwTB-QWFzRghozp6gzKOuI4dwY_Hd0gdS46STq6EoMPYP3iQHuulBGDbiOwyz3Kd7vgFbcZxHIMnrQnwwXDAdGv9nrseI5PZf786ZOYyC5zvzQYSR3UHo3wpa3JQT9C63P4PlGbiIwE2fJDKU7ZYzUX2HAjfhOuoOQf7iP56ImjUDx_CsfAwEpJnqJHadUNmMudKyUGwzgLWVS_JKL99wHYz3UJfwbvFDMUBhXTlGjSrJKy-Fh6MFEiHR6D4_G0w',
  },
  {
    title: 'Real-time Supply Tracking',
    text: 'Stay informed about urgent blood type needs and track the journey of your donated units.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRugzP9wGrYoqHab5jozufSA4_T5ZjREGPt8W2kYdBp3uAjERW-1h_lbe29D_3FihJakRylna5TQIBZY3F7AcGRhTKatg5Cowyb6nXyZevWUP4dqPi9f5pvo2zT6876wCREEvjFRU9HqunHiHx9W_cgj8W_4DhhhXzllRIPu55Nrjc1dgNBAvYfvaf3MgGYvV8MxtYJT1WvQ_CQddhLtNmxIcaml4sazmLShV9QCkcKCmjHWQGdn_B4SVYsHAsnTTOmBN66Op91Fw',
  },
];

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const portal = searchParams.get('portal') || 'donor'
  
  const [email, setEmail] = useState('donor@redcross.org')
  const [password, setPassword] = useState('')
  const [staffId, setStaffId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeSlideIndex, setActiveSlideIndex] = useState(portal === 'admin' ? 1 : 0)
  
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const loginEmail = portal === 'admin' 
        ? (staffId.includes('sa-') || staffId.includes('super') ? 'superadmin@redcross.test' : 'admin@redcross.test')
        : email;

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password
      })

      if (authError) throw authError

      // Auto-upgrade test accounts to their respective roles if they are using the admin portal
      if (loginEmail === 'admin@redcross.test') {
        await supabase.from('profiles').update({ role: 'admin' }).eq('id', data.user.id)
      } else if (loginEmail === 'superadmin@redcross.test') {
        await supabase.from('profiles').update({ role: 'super_admin' }).eq('id', data.user.id)
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      const role = profile?.role || 'donor'
      
      if (role === 'admin' || role === 'super_admin' || loginEmail === 'admin@redcross.test' || loginEmail === 'superadmin@redcross.test') {
        router.push('/admin/reports')
      } else {
        router.push('/donor/dashboard')
      }
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to sign in.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-body">
      <section className="login-frame">
        <div className="login-inner">
          <header className="login-brand">
            <div className="login-brand-title">
              <span className="font-medium text-red-600">bloodtype</span>
              <span className="font-extrabold text-black">RedCross Blood Bank</span>
            </div>
            <p className="mt-2 text-xs text-[#3a0a00]">Saving Lives Through Every Donation</p>
          </header>

          <div className="login-stage">
            <section className="login-card">
              {error && (
                <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                    <p className="font-extrabold">Authentication Error</p>
                    <p className="mt-1">{error}</p>
                </div>
              )}

              <div className="login-tabs">
                <Link 
                  href="/login?portal=donor"
                  className={`login-tab ${portal !== 'admin' ? 'is-active' : ''}`}
                >
                  Donor Portal
                </Link>
                <Link 
                  href="/login?portal=admin"
                  className={`login-tab ${portal === 'admin' ? 'is-active' : ''}`}
                >
                  Admin Access
                </Link>
              </div>

              <h1 className="text-[20px] font-extrabold tracking-[-0.03em]">
                {portal === 'admin' ? 'Clinical Admin Login' : 'Welcome to the Donor Portal'}
              </h1>
              <p className="mt-4 max-w-[250px] text-xs leading-[1.55] text-[#5f3f3a]">
                {portal === 'admin' ? 'Access staff resources and laboratory management tools.' : 'Sign in to manage your appointments and view your contribution history.'}
              </p>

              <form onSubmit={handleLogin} className="mt-7 space-y-[18px]">
                {portal === 'admin' ? (
                  <>
                    <div>
                      <label className="label">Staff ID</label>
                      <input 
                        className="input" 
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                        placeholder="E.g. RC-44920" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="label">Secure Admin Password</label>
                      <input 
                        className="input" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="........" 
                        required 
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="label">Email Address</label>
                      <input 
                        className="input" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="donor@redcross.org" 
                        required 
                      />
                    </div>
                    <div>
                      <div className="mb-2 flex items-end justify-between gap-3">
                        <label className="label mb-0">Password</label>
                        <button className="text-xs font-extrabold text-red-600 hover:underline" type="button">Forgot password?</button>
                      </div>
                      <input 
                        className="input" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="........" 
                        required 
                      />
                    </div>
                  </>
                )}

                <label className="flex items-center gap-3 pt-1 text-xs text-[#5f3f3a]">
                  <input className="h-4 w-4 rounded border-[#e9bcb5] bg-[#f6f3f2] text-red-600" type="checkbox" name="remember" />
                  Remember this device
                </label>

                <button disabled={loading} className="btn-primary login-submit w-full py-[14px] text-sm" type="submit">
                  {loading ? 'Authenticating...' : portal === 'admin' ? 'Verify Admin Credentials' : 'Access Portal Login'}
                </button>
              </form>

              {portal !== 'admin' && (
                <p className="mt-[18px] text-center text-xs text-[#5f3f3a]">
                  Don&apos;t have an account?{' '}
                  <Link className="font-extrabold text-red-600 hover:underline" href="/register">Register as a Donor</Link>
                </p>
              )}

              <footer className="mt-10 border-t border-[#e9bcb5]/25 pt-7 text-center text-xs text-[#5f3f3a]">
                Need help with your donor account?<br/>
                <button className="font-extrabold text-red-600 hover:underline" type="button">Contact Donor Support</button>
              </footer>
            </section>

            <aside className="login-slide login-carousel" aria-label="Donation highlights">
              {slides.map((slide, index) => (
                <article key={index} className={`login-carousel-slide ${index === activeSlideIndex ? 'is-active' : ''}`}>
                  <img src={slide.image} alt={slide.title} />
                  <div className="login-slide-copy">
                    <h2 className="text-[18px] font-extrabold">{slide.title}</h2>
                    <p className="mt-3 max-w-[310px] text-xs font-semibold leading-[1.55]">{slide.text}</p>
                  </div>
                </article>
              ))}

              <button onClick={() => setActiveSlideIndex(activeSlideIndex === 0 ? 1 : 0)} className="carousel-arrow is-left" type="button" aria-label="Previous slide">
                  <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setActiveSlideIndex(activeSlideIndex === 0 ? 1 : 0)} className="carousel-arrow is-right" type="button" aria-label="Next slide">
                  <ChevronRight className="w-5 h-5" />
              </button>

              <div className="login-carousel-dots" role="tablist" aria-label="Slide selector">
                  {slides.map((slide, index) => (
                      <button
                          key={index}
                          onClick={() => setActiveSlideIndex(index)}
                          className={`login-carousel-dot ${index === activeSlideIndex ? 'is-active' : ''}`}
                          type="button"
                          aria-label={`Show ${slide.title}`}
                          aria-selected={index === activeSlideIndex}
                      ></button>
                  ))}
              </div>
            </aside>
          </div>

          <footer className="login-status">
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-2"><span className="login-status-dot"></span> Clinical Network Active</span>
              <span>Verified_User</span>
              <span>HIPAA Compliant</span>
            </div>
            <span className="text-red-300">RedCross Vita-Portal v2.1</span>
          </footer>
        </div>
      </section>
    </main>
  )
}

export default function LoginPage() { return <Suspense fallback={<div>Loading...</div>}><LoginContent /></Suspense> }

