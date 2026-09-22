'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { FileText, MapPin, Calendar, CheckCircle2, Check, Droplet, ClipboardList, User } from 'lucide-react'
import dynamic from 'next/dynamic'

const MapWithNoSSR = dynamic(() => import('@/components/Map'), { ssr: false })

export default function SchedulePage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const [serviceType, setServiceType] = useState('Donor Appointment')
  const [centerId, setCenterId] = useState('CTR-SR-LAGUNA')
  const [centerName, setCenterName] = useState('PRC Laguna Chapter - Santa Rosa Branch')
  const [centerAddress, setCenterAddress] = useState('Rotary Lane, Brgy. Tagapo, City of Santa Rosa, Laguna')
  const [centerTag, setCenterTag] = useState('Santa Rosa, Laguna')
  const [centerPin, setCenterPin] = useState('14.31554, 121.11104')

  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('10:30 AM')

  const steps = ['Eligibility', 'Service', 'Forms', 'Location', 'Date & Time', 'Confirmation']

  const centers = [
    { id: 'CTR-SR-LAGUNA', name: 'PRC Laguna Chapter - Santa Rosa Branch', address: 'Rotary Lane, Brgy. Tagapo, City of Santa Rosa, Laguna', type: 'Santa Rosa Red Cross', tag: 'Santa Rosa, Laguna', lat: 14.31554, lng: 121.11104, pin: '14.31554, 121.11104' },
    { id: 'CTR-MAKATI-HQ', name: 'Makati National HQ', address: '37 EDSA corner Boni Avenue, Mandaluyong City', type: 'Collection Point', tag: 'Makati HQ', lat: 14.5764, lng: 121.0359, pin: '14.57640, 121.03590' },
  ]

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('User not found')

      const scheduled_at = scheduledDate ? new Date(`${scheduledDate} ${scheduledTime}`).toISOString() : new Date().toISOString()

      const { error: insertError } = await supabase.from('appointments').insert({
        profile_id: user.id,
        donation_center_id: centerId || 'CTR-SR-LAGUNA',
        service_type: serviceType,
        scheduled_at: scheduled_at,
        status: 'pending'
      })

      if (insertError) throw insertError

      setConfirmed(true)
    } catch(err: any) {
      setError('Failed to book appointment: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <header className="page-header stagger-1">
        <h2 className="page-title">Book Your Life-Saving Appointment</h2>
        <p className="page-subtitle">Choose your preferred slot below.</p>
      </header>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-red-800 stagger-2">
          {error}
        </div>
      )}

      {confirmed && (
        <section className="schedule-confirmed card stagger-2">
            <div className="schedule-confirmed-flag">
                <Check />
                <strong>{serviceType === 'Blood Request' ? 'Request' : 'Appointment'}<br />Submitted</strong>
            </div>
            <div className="schedule-confirmed-copy">
                <h2>Salamat, Donor!</h2>
                <p>{serviceType === 'Blood Request' ? 'Your blood request has been submitted for review.' : 'Your appointment is scheduled and waiting for staff review.'}</p>
                <button className="btn-primary mt-6" type="button" onClick={() => { setConfirmed(false); setStep(1); }}>Book Another</button>
            </div>
        </section>
      )}

      <div className={`schedule-wizard ${confirmed ? 'is-confirmed' : ''} stagger-2`} hidden={confirmed}>
          <div className="card mb-6 schedule-steps">
              {steps.map((label, index) => (
                  <div key={label} className={`schedule-step ${step === index + 1 ? 'is-active' : ''}`}>
                      <span>{index + 1}</span>
                      <strong>{label}</strong>
                  </div>
              ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <form onSubmit={handleSubmit} className="card p-6" encType="multipart/form-data">
                {step === 1 && (
                  <section>
                      <h2 className="section-title mb-5">Eligibility Screening</h2>
                      <div className="schedule-deferred-alert" hidden>
                          <strong>Deferred</strong>
                          <span>One or more screening answers require staff review before you can continue with a donation booking.</span>
                      </div>
                      <div className="space-y-3">
                          {[
                              ['fever', 'Do you currently have a fever or feel unwell?'],
                              ['surgery', 'Have you had surgery in the last 6 months?'],
                              ['tattoo', 'Recent tattoo or piercing within the last 6 months?'],
                              ['antibiotics', 'Are you taking antibiotics or under treatment for infection?'],
                              ['infection_test', 'Have you ever tested positive for HIV, Hepatitis B, or Hepatitis C?'],
                          ].map(([name, question]) => (
                              <label key={name} className="flex items-center justify-between gap-4 rounded-lg border border-red-100 bg-stone-50 p-4 text-base">
                                  <span>{question}</span>
                                  <input className="size-4 shrink-0 rounded border-stone-400" type="checkbox" name={name} value="1" />
                              </label>
                          ))}
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                          <div>
                              <label className="label">Hemoglobin</label>
                              <input className="input" name="hemoglobin" defaultValue="14.2" />
                          </div>
                          <div>
                              <label className="label">Blood Pressure</label>
                              <input className="input" name="blood_pressure" defaultValue="118/76" />
                          </div>
                      </div>

                      <button className="btn-primary mt-6" type="button" onClick={nextStep}>Confirm and Proceed</button>
                  </section>
                )}

                {step === 2 && (
                  <section>
                      <h2 className="section-title mb-5">Choose Service Type</h2>
                      <div className="schedule-service-grid">
                          <button className={`schedule-choice ${serviceType === 'Donor Appointment' ? 'is-selected' : ''}`} type="button" onClick={() => setServiceType('Donor Appointment')}>
                              <Droplet />
                              <strong>Donor Appointment</strong>
                              <span>Schedule a life-saving blood donation.</span>
                          </button>
                          <button className={`schedule-choice ${serviceType === 'Blood Request' ? 'is-selected' : ''}`} type="button" onClick={() => setServiceType('Blood Request')}>
                              <ClipboardList />
                              <strong>Blood Request</strong>
                              <span>Request blood units for patients or facilities.</span>
                          </button>
                      </div>
                      <div className="schedule-actions mt-6">
                          <button className="btn-outline" type="button" onClick={prevStep}>Back</button>
                          <button className="btn-primary" type="button" onClick={nextStep}>Next: Forms</button>
                      </div>
                  </section>
                )}

                {step === 3 && (
                  <section>
                      {serviceType === 'Donor Appointment' && (
                        <div>
                            <div className="text-center">
                                <h2 className="page-title text-3xl">Donor Registration</h2>
                                <p className="page-subtitle">Your contribution is a lifeline. Complete your donor details before choosing a center.</p>
                            </div>
                            <div className="schedule-form-card mt-7">
                                <div className="form-grid">
                                    <div><label className="label">Full Name</label><input className="input" name="donor_full_name" placeholder="Enter your full legal name" /></div>
                                    <div><label className="label">Age</label><input className="input" name="donor_age" type="number" min="18" placeholder="Minimum 18 years" /></div>
                                    <div>
                                        <label className="label">Blood Type</label>
                                        <select className="select" name="donor_blood_type" defaultValue="">
                                            <option value="" disabled>Select blood type</option>
                                            {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div><label className="label">Weight (kg)</label><input className="input" name="donor_weight_kg" type="number" min="40" step="0.1" placeholder="Minimum 50kg" /></div>
                                    <div><label className="label">Contact Number</label><input className="input" name="donor_contact_number" placeholder="+63 912 345 6789" /></div>
                                    <div><label className="label">Last Donation Date</label><input className="input" name="donor_last_donation_date" type="date" /></div>
                                </div>
                                <div className="mt-4"><label className="label">Residential Address</label><textarea className="textarea" name="donor_address" placeholder="Enter your full mailing address"></textarea></div>
                                <div className="mt-5 border-t border-red-100 pt-5">
                                    <h3 className="section-title">Medical History</h3>
                                    <p className="mt-1 text-sm text-stone-600">Check all that apply for safety screening.</p>
                                    <div className="medical-grid mt-4">
                                        {['Diabetes','Hypertension','Recent Surgery','Allergies','Anemia','Infectious Disease'].map(flag => (
                                            <label key={flag}><input type="checkbox" name="donor_medical_flags[]" value={flag} /> {flag}</label>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4"><label className="label">Other Medical Conditions / Details</label><textarea className="textarea" name="donor_medical_notes" placeholder="Describe any other conditions or medications..."></textarea></div>
                                <label className="mt-5 flex items-start gap-3 text-sm text-stone-700">
                                    <input className="mt-1" type="checkbox" name="donor_certified" value="1" />
                                    <span>I certify that the information provided is true and accurate to the best of my knowledge.</span>
                                </label>
                            </div>
                        </div>
                      )}

                      {serviceType === 'Blood Request' && (
                        <div>
                            <h2 className="section-title text-2xl">Blood Request Form</h2>
                            <p className="page-subtitle">Initialize blood requirements for medical facilities with accurate recipient data.</p>
                            <div className="schedule-request-grid mt-6">
                                <div className="space-y-4">
                                    <section className="schedule-form-card">
                                        <h3 className="section-title flex items-center gap-2"><User /> Patient Details</h3>
                                        <div className="form-grid mt-4">
                                            <div><label className="label">Patient Full Name</label><input className="input" name="patient_name" placeholder="Enter recipient's full legal name" /></div>
                                            <div><label className="label">Hospital / Medical Center Name</label><input className="input" name="hospital_name" placeholder="e.g., Central General Hospital" /></div>
                                            <div><label className="label">Attending Physician's Name</label><input className="input" name="physician_name" placeholder="Dr. Smith" /></div>
                                            <div><label className="label">Contact Person & Number</label><input className="input" name="request_contact_person" placeholder="Nurse or request coordinator" /></div>
                                            <div><label className="label">Contact Number</label><input className="input" name="contact_number" placeholder="+1 (555) 000-0000" /></div>
                                        </div>
                                    </section>
                                    <section className="schedule-form-card">
                                        <h3 className="section-title flex items-center gap-2"><Droplet /> Request Specifications</h3>
                                        <div className="form-grid mt-4">
                                            <div>
                                                <label className="label">Blood Type Needed</label>
                                                <select className="select" name="blood_type" defaultValue="">
                                                    <option value="" disabled>Select blood type</option>
                                                    {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(type => (
                                                        <option key={type} value={type}>{type}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div><label className="label">Units Needed</label><input className="input" name="units_needed" type="number" min="1" placeholder="Quantity of units" /></div>
                                            <div>
                                                <label className="label">Component Type</label>
                                                <select className="select" name="component_type" defaultValue="">
                                                    <option value="" disabled>Select component type</option>
                                                    {['Whole Blood','Packed RBC','Platelets','Plasma','Cryoprecipitate'].map(component => (
                                                        <option key={component} value={component}>{component}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div><label className="label">Required By Date/Time</label><input className="input" name="required_at" type="datetime-local" /></div>
                                        </div>
                                        <div className="urgency-grid mt-4">
                                            {[
                                                { value: 'routine', label: 'Routine' },
                                                { value: 'urgent', label: 'Urgent' },
                                                { value: 'emergency', label: 'Emergency' }
                                            ].map(({value, label}) => (
                                                <label key={value}><input type="radio" name="urgency" value={value} defaultChecked={value === 'routine'} /> {label}</label>
                                            ))}
                                        </div>
                                    </section>
                                    <section className="schedule-form-card">
                                        <h3 className="section-title flex items-center gap-2"><FileText /> Medical Information</h3>
                                        <div className="mt-4"><label className="label">Diagnosis / Reason for Request</label><textarea className="textarea" name="diagnosis" placeholder="Detailed clinical diagnosis and reason for transfusion..."></textarea></div>
                                        <div className="mt-4"><label className="label">Medical Justification</label><textarea className="textarea" name="medical_justification" placeholder="Clinical justification and notes..."></textarea></div>
                                        <div className="mt-4"><label className="label">Supporting Document</label><input className="input" name="supporting_document" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" /></div>
                                        <div className="mt-4"><label className="label">Document Description</label><input className="input" name="document_description" placeholder="e.g., laboratory result or physician order" /></div>
                                    </section>
                                </div>
                            </div>
                        </div>
                      )}

                      <div className="schedule-actions mt-6">
                          <button className="btn-outline" type="button" onClick={prevStep}>Back</button>
                          <button className="btn-primary" type="button" onClick={nextStep}>Next: Location</button>
                      </div>
                  </section>
                )}

                {step === 4 && (
                  <section>
                      <h2 className="section-title mb-5">Select Donation Center</h2>
                      <div className="schedule-map-card">
                          <div className="schedule-leaflet-map" style={{ minHeight: '300px' }}>
                              <MapWithNoSSR 
                                lat={centers.find(c => c.name === centerName)?.lat || 14.31554} 
                                lng={centers.find(c => c.name === centerName)?.lng || 121.11104} 
                                name={centerName} 
                              />
                          </div>
                          <div className="schedule-center-details">
                              <div>
                                  <p className="eyebrow red">Selected Center</p>
                                  <select className="select mt-3" 
                                    value={centerName} 
                                    onChange={(e) => {
                                        const c = centers.find(center => center.name === e.target.value);
                                        if (c) {
                                            setCenterId(c.id);
                                            setCenterName(c.name);
                                            setCenterAddress(c.address);
                                            setCenterTag(c.tag);
                                            setCenterPin(c.pin);
                                        }
                                    }}>
                                      {centers.map(center => (
                                          <option key={center.id} value={center.name}>{center.name}</option>
                                      ))}
                                  </select>
                                  <h3 className="mt-4 text-xl font-extrabold">{centerName}</h3>
                                  <p className="mt-1 text-stone-600">{centerAddress}</p>
                                  <p className="mt-2 text-sm font-bold text-stone-500">Map pin: <span>{centerPin}</span></p>
                              </div>
                              <span className="badge is-active">{centerTag}</span>
                          </div>
                      </div>
                      <div className="schedule-actions mt-6">
                          <button className="btn-outline" type="button" onClick={prevStep}>Back</button>
                          <button className="btn-primary" type="button" onClick={nextStep}>Next: Date and Time</button>
                      </div>
                  </section>
                )}

                {step === 5 && (
                  <section>
                      <h2 className="section-title mb-5">Select Date and Time</h2>
                      <div className="schedule-date-grid">
                          <div className="schedule-date-card">
                              <label className="label" htmlFor="scheduled_date">Appointment Date</label>
                              <input id="scheduled_date" className="input" type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} required />
                              <div className="schedule-selected-date">Selected: <span>{scheduledDate ? new Date(scheduledDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'None'}</span></div>
                          </div>
                          <div className="schedule-time-grid">
                              {['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM'].map((time) => (
                                  <button key={time} className={`schedule-time ${time === scheduledTime ? 'is-selected' : ''}`} type="button" onClick={() => setScheduledTime(time)}>{time}</button>
                              ))}
                          </div>
                      </div>
                      <div className="schedule-actions mt-6">
                          <button className="btn-outline" type="button" onClick={prevStep}>Back</button>
                          <button className="btn-primary" type="button" onClick={nextStep}>Review Selection</button>
                      </div>
                  </section>
                )}

                {step === 6 && (
                  <section>
                      <h2 className="section-title mb-5">Confirm Booking</h2>
                      <div className="schedule-review">
                          <div>
                              <p className="eyebrow">Service</p>
                              <strong>{serviceType}</strong>
                              <span>{serviceType === 'Donor Appointment' ? 'Donor registration details ready.' : 'Blood request details ready.'}</span>
                          </div>
                          <div>
                              <p className="eyebrow">Location</p>
                              <strong>{centerName}</strong>
                              <span>{centerAddress}</span>
                          </div>
                          <div>
                              <p className="eyebrow">Date and Time</p>
                              <strong>{scheduledDate ? new Date(scheduledDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'None'}</strong>
                              <span><span>{scheduledTime}</span></span>
                          </div>
                      </div>
                      <div className="schedule-actions mt-6">
                          <button className="btn-ghost" type="button" onClick={prevStep}>Edit Selection</button>
                          <button className="btn-primary" type="submit" disabled={loading}>
                            {loading ? 'Booking...' : 'Confirm and Book'}
                          </button>
                      </div>
                  </section>
                )}
              </form>

              <aside className="space-y-4">
                  <div className="card stagger-3 p-5">
                      <h3 className="font-bold text-red-700">Prep Tips</h3>
                      <p className="mt-2 text-sm text-stone-600">Hydrate and bring a valid ID before your visit.</p>
                  </div>
                  <div className="rounded-xl stagger-4 bg-red-700 p-5 text-white shadow-lg transition-transform hover:-translate-y-1">
                      <p className="text-xs font-bold uppercase">Your lifetime impact</p>
                      <p className="mt-2 text-2xl font-extrabold">12 Lives Saved</p>
                  </div>
              </aside>
          </div>
      </div>
    </div>
  )
}
