'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  date_range: string;
  status: string;
  image_url: string;
}

export function CampaignHeaderActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="btn-primary flex items-center justify-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={16} />
        New Campaign
      </button>

      {isOpen && (
        <CampaignModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}

export function CampaignEditButton({ campaign }: { campaign: Campaign }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="text-red-700 hover:underline"
        onClick={() => setIsOpen(true)}
      >
        Edit
      </button>

      {isOpen && (
        <CampaignModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          campaign={campaign}
        />
      )}
    </>
  );
}

function CampaignModal({ isOpen, onClose, campaign }: { isOpen: boolean, onClose: () => void, campaign?: Campaign }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      window.location.reload();
    }, 800);
  };

  return (
    <div className="modal-shell">
      <div className="modal-backdrop" onClick={onClose}></div>
      <form className="modal-panel modal-panel-lg modal-panel-form" onSubmit={handleSubmit}>
        <div className="modal-header flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold">{campaign ? 'Edit Campaign' : 'Create Campaign'}</h2>
          <button className="text-stone-500 hover:text-red-700 font-bold px-2 py-1" type="button" onClick={onClose}>x</button>
        </div>
        
        <div className="modal-body-scroll overflow-y-auto max-h-[70vh] px-1 space-y-4">
          {campaign && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 font-medium">
              Editing existing campaigns is ready in the UI, but no safe update route exists yet. Save is disabled so an existing campaign is not accidentally duplicated.
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="label text-sm font-bold block mb-1">Campaign Title</label>
              <input className="input w-full p-2 border rounded" name="title" defaultValue={campaign?.title || ''} required />
            </div>
            <div>
              <label className="label text-sm font-bold block mb-1">Status</label>
              <select className="select w-full p-2 border rounded" name="status" defaultValue={campaign?.status || 'Upcoming'}>
                <option>Active</option>
                <option>Upcoming</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="label text-sm font-bold block mb-1">Date Range</label>
              <input className="input w-full p-2 border rounded" name="date_range" defaultValue={campaign?.date_range || ''} placeholder="e.g. Jul 15 - Aug 15" required />
            </div>
            <div>
              <label className="label text-sm font-bold block mb-1">Description</label>
              <textarea className="input w-full p-2 border rounded min-h-[100px]" name="description" defaultValue={campaign?.description || ''} required></textarea>
            </div>
            <div>
              <label className="label text-sm font-bold block mb-1">Image URL</label>
              <input className="input w-full p-2 border rounded" name="image_url" defaultValue={campaign?.image_url || ''} />
            </div>
          </div>
        </div>
        
        <div className="modal-actions flex justify-end gap-2 border-t pt-4 mt-4">
          <button className="btn-outline px-4 py-2" type="button" onClick={onClose}>Cancel</button>
          <button className="btn-primary px-4 py-2" type="submit" disabled={loading || !!campaign}>
            {loading ? 'Saving...' : 'Save Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
}
