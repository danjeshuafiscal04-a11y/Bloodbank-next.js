'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function NewDonorButtonAndModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="btn-primary" 
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={16} /> New Donor
      </button>

      {isOpen && (
        <div id="new-donor-modal" className="modal-shell">
          <div className="modal-backdrop" onClick={() => setIsOpen(false)}></div>
          <form className="modal-panel modal-panel-lg modal-panel-form" method="post" action="/admin/donors/store">
            <div className="modal-header">
              <h2>Donor Registration</h2>
              <button 
                className="modal-close" 
                type="button" 
                aria-label="Close donor registration"
                onClick={() => setIsOpen(false)}
              >
                x
              </button>
            </div>
            <div className="modal-body-scroll">
              <div className="form-grid">
                <div><label className="label">Full Name</label><input className="input" name="full_name" placeholder="Juan Dela Cruz" required /></div>
                <div><label className="label">Age</label><input className="input" name="age" type="number" min="18" placeholder="Minimum 18 years" /></div>
                <div>
                  <label className="label">Blood Type</label>
                  <select className="select" name="blood_type" required>
                    <option value="">Select blood type</option>
                    {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(type => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div><label className="label">Weight</label><input className="input" name="weight" type="number" min="40" placeholder="Minimum 50kg" /></div>
                <div><label className="label">Contact Number</label><input className="input" name="contact" placeholder="+63 912 345 6789" required /></div>
                <div><label className="label">Last Donation Date</label><input className="input" name="last_donation_label" type="date" /></div>
              </div>
              <div className="mt-4"><label className="label">Residential Address</label><textarea className="textarea" name="address" placeholder="Enter full mailing address"></textarea></div>
              <div className="mt-5">
                <p className="label">Medical History</p>
                <div className="medical-grid">
                  <label><input type="checkbox" name="medical_flags[]" value="Diabetes" /> Diabetes</label>
                  <label><input type="checkbox" name="medical_flags[]" value="Hypertension" /> Hypertension</label>
                  <label><input type="checkbox" name="medical_risk" value="1" /> Recent Surgery</label>
                  <label><input type="checkbox" name="medical_flags[]" value="Allergies" /> Allergies</label>
                  <label><input type="checkbox" name="medical_flags[]" value="Anemia" /> Anemia</label>
                  <label><input type="checkbox" name="medical_flags[]" value="Infectious Disease" /> Infectious Disease</label>
                </div>
              </div>
              <div className="mt-4"><label className="label">Other Medical Details</label><textarea className="textarea" name="medical_notes" placeholder="Describe conditions or medications..."></textarea></div>
              <label className="mt-5 flex items-center gap-3 text-sm text-stone-700">
                <input type="checkbox" required /> I certify that the information provided is true and accurate.
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" type="button" onClick={() => setIsOpen(false)}>Cancel</button>
              <button className="btn-primary" type="submit">Submit Registration</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
