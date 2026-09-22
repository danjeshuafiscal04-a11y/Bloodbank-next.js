'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import GenerateReportButton from './GenerateReportButton';
import AddEntryModal from './AddEntryModal';

interface Props {
  totalUnits: number;
}

export default function InventoryHeaderActions({ totalUnits }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex gap-3">
      <GenerateReportButton type="inventory" data={{ total: totalUnits }} />
      <button 
        className="btn-primary flex items-center justify-center gap-2"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={16} />
        Add Entry
      </button>
      
      <AddEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} staffName="Admin" />
    </div>
  );
}
