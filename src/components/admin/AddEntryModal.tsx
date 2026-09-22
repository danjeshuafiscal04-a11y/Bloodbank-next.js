'use client';

import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  staffName: string;
}

export default function AddEntryModal({ isOpen, onClose, staffName }: Props) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate save, actual saving would connect to Supabase Server Actions
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      onClose();
      // Need a router.refresh() in the parent or similar
      window.location.reload(); 
    }, 800);
  };

  return (
    <div className="modal-shell">
      <div className="modal-backdrop" onClick={onClose}></div>
      <form className="modal-panel modal-panel-lg modal-panel-form" onSubmit={handleSubmit}>
        <div className="modal-header flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold">Add Walk-in Donation</h2>
          <button className="text-stone-500 hover:text-red-700 font-bold px-2 py-1" type="button" onClick={onClose} aria-label="Close walk-in donation form">x</button>
        </div>
        <div className="modal-body-scroll overflow-y-auto max-h-[70vh] px-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label text-sm font-bold block mb-1">Donor Name</label><input className="input w-full p-2 border rounded" name="donor_name" placeholder="Walk-in donor name" required /></div>
            <div><label className="label text-sm font-bold block mb-1">Donor ID or Walk-in/New Donor</label><input className="input w-full p-2 border rounded" name="donor_code" defaultValue="Walk-in/New Donor" /></div>
            <div><label className="label text-sm font-bold block mb-1">Contact Number</label><input className="input w-full p-2 border rounded" name="contact_number" placeholder="+63 912 345 6789" /></div>
            <div>
              <label className="label text-sm font-bold block mb-1">Blood Type</label>
              <select className="select w-full p-2 border rounded" name="blood_type" required>
                <option value="">Select blood type</option>
                {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(type => <option key={type}>{type}</option>)}
              </select>
            </div>
            <div><label className="label text-sm font-bold block mb-1">Units Donated</label><input className="input w-full p-2 border rounded" name="units" type="number" min="1" defaultValue="1" /></div>
            <div>
              <label className="label text-sm font-bold block mb-1">Donation Type / Component Type</label>
              <select className="select w-full p-2 border rounded" name="component_type" required>
                <option value="">Select donation type / component type</option>
                <option>Whole Blood</option>
                <option>Platelets</option>
                <option>Plasma</option>
              </select>
            </div>
            <div><label className="label text-sm font-bold block mb-1">Collection Date</label><input className="input w-full p-2 border rounded" name="collection_date" type="date" required /></div>
            <div><label className="label text-sm font-bold block mb-1">Collection Time</label><input className="input w-full p-2 border rounded" name="collection_time" type="time" required /></div>
            <div><label className="label text-sm font-bold block mb-1">Facility / Collection Site</label><input className="input w-full p-2 border rounded" name="facility" defaultValue="PRC Laguna Chapter - Santa Rosa Branch" required /></div>
            <div><label className="label text-sm font-bold block mb-1">Staff/Admin Name</label><input className="input w-full p-2 border rounded" name="staff_name" defaultValue={staffName || 'Admin'} required /></div>
            <div>
              <label className="label text-sm font-bold block mb-1">Screening Status</label>
              <select className="select w-full p-2 border rounded" name="screening_status">
                <option>Passed</option>
                <option>Failed</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-actions flex justify-end gap-2 border-t pt-4 mt-4">
          <button className="btn-outline px-4 py-2" type="button" onClick={onClose}>Cancel</button>
          <button className="btn-primary px-4 py-2" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Walk-in Donation'}
          </button>
        </div>
      </form>
    </div>
  );
}
