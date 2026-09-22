'use client'

import { useState } from 'react'

export default function DonorRecordsTable({ donors }: { donors: any[] }) {
  const [selectedDonor, setSelectedDonor] = useState<any | null>(null)

  const cleanValue = (val: any) => {
    if (Array.isArray(val)) {
      const flattened = val.flat().filter(item => item !== null && item !== undefined && item !== '');
      return flattened.length > 0 ? flattened.join(', ') : 'Not provided';
    }
    return val !== null && val !== undefined && val !== '' ? String(val) : 'Not provided';
  };

  const formatTitle = (str: string) => {
    return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  return (
    <>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Donor Name</th>
              <th>Blood Type</th>
              <th>Contact Info</th>
              <th>Last Donation</th>
              <th>Status</th>
              <th>Units</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donors.length > 0 ? (
              donors.map((donor) => {
                const name = donor.full_name || donor.name || 'Unnamed Donor';
                const parts = name.split(' ').filter(Boolean);
                const initials = parts.slice(0, 2).map((p: string) => p[0].toUpperCase()).join('');
                const status = donor.eligibility_status || donor.status || 'Eligible';
                const units = donor.total_units || donor.units || 0;
                
                return (
                  <tr key={donor.donor_code || donor.id} data-donor-blood={donor.blood_type || 'O-'}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="avatar">{initials || 'RC'}</span>
                        <div>
                          <p className="font-bold">{name}</p>
                          <p className="text-xs text-stone-500">ID: {donor.donor_code || donor.id || 'D-00000'}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge">{donor.blood_type || 'O-'}</span></td>
                    <td className="text-stone-600">
                      {donor.email || donor.contact || 'No contact'}
                      {donor.contact && donor.email && (
                        <><br />{donor.contact}</>
                      )}
                    </td>
                    <td>{donor.last_donation_label || donor.lastDonation || 'Never'}</td>
                    <td><span className={`badge ${status === 'Deferred' ? 'status-warning' : ''}`}>{status}</span></td>
                    <td className="font-bold">{units}</td>
                    <td>
                      <button 
                        className="font-bold text-red-700 hover:text-red-900" 
                        type="button"
                        onClick={() => setSelectedDonor(donor)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-stone-500">
                  No donor records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedDonor && (() => {
        const donor = selectedDonor;
        const name = donor.full_name || donor.name || 'Unnamed Donor';
        const parts = name.split(' ').filter(Boolean);
        const initials = parts.slice(0, 2).map((p: string) => p[0].toUpperCase()).join('');
        const status = donor.eligibility_status || donor.status || 'Eligible';
        const registration = donor.registration_details || {};
        const screening = donor.screening_details || {};
        const formPayload = donor.form_payload || {};
        const formSummary = formPayload.donor_form || formPayload.blood_request_form || formPayload;
        
        const contact = donor.contact || registration.contact || registration.contact_number || null;
        const email = donor.email || registration.email || null;

        return (
          <div className="modal-shell">
            <div className="modal-backdrop" onClick={() => setSelectedDonor(null)}></div>
            <section className="modal-panel modal-panel-lg donor-detail-modal" role="dialog" aria-modal="true">
              <div className="modal-header">
                <div className="flex items-center gap-3">
                  <span className="avatar">{initials || 'RC'}</span>
                  <div>
                    <p className="eyebrow">Donor Detail</p>
                    <h2>{name}</h2>
                  </div>
                </div>
                <button className="modal-close" type="button" aria-label="Close donor detail" onClick={() => setSelectedDonor(null)}>x</button>
              </div>

              <div className="donor-detail-body">
                <div className="detail-hero">
                  <div>
                    <span className="badge is-active">{donor.blood_type || 'O-'}</span>
                    <span className={`badge ${status === 'Deferred' ? 'status-warning' : ''}`}>{status}</span>
                  </div>
                  <div className="detail-grid mt-4">
                    <div><span>Donor ID</span><strong>{donor.donor_code || donor.id || 'Not provided'}</strong></div>
                    <div><span>Email</span><strong>{cleanValue(email)}</strong></div>
                    <div><span>Contact</span><strong>{cleanValue(contact)}</strong></div>
                    <div><span>Last Donation</span><strong>{donor.last_donation_label || donor.lastDonation || 'Never'}</strong></div>
                    <div><span>Units</span><strong>{donor.total_units || donor.units || 0}</strong></div>
                  </div>
                </div>

                <div className="detail-section-grid">
                  <section className="detail-section">
                    <h3>Registration Details</h3>
                    <dl className="detail-list">
                      <div><dt>Age</dt><dd>{cleanValue(registration.age || donor.age)}</dd></div>
                      <div><dt>Weight</dt><dd>{cleanValue(registration.weight || donor.weight)}</dd></div>
                      <div><dt>Address</dt><dd>{cleanValue(registration.address || donor.address)}</dd></div>
                      <div><dt>Last Donation Date</dt><dd>{cleanValue(registration.last_donation_date || donor.last_donation_date)}</dd></div>
                    </dl>
                  </section>
                  <section className="detail-section">
                    <h3>Screening Details</h3>
                    <dl className="detail-list">
                      <div><dt>Hemoglobin</dt><dd>{cleanValue(screening.hemoglobin || donor.hemoglobin)}</dd></div>
                      <div><dt>Blood Pressure</dt><dd>{cleanValue(screening.blood_pressure || donor.blood_pressure)}</dd></div>
                      <div><dt>Temperature</dt><dd>{cleanValue(screening.temperature)}</dd></div>
                      <div><dt>Notes</dt><dd>{cleanValue(screening.notes || screening.medical_notes)}</dd></div>
                    </dl>
                  </section>
                </div>

                <section className="detail-section">
                  <h3>Form Summary</h3>
                  {Object.keys(formSummary).length > 0 ? (
                    <dl className="detail-list detail-list-wide">
                      {Object.entries(formSummary).map(([key, value]) => (
                        <div key={key}>
                          <dt>{formatTitle(key)}</dt>
                          <dd>{cleanValue(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="empty-note">No submitted schedule form is linked to this donor yet.</p>
                  )}
                </section>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" type="button" onClick={() => setSelectedDonor(null)}>Close</button>
              </div>
            </section>
          </div>
        )
      })()}
    </>
  )
}
