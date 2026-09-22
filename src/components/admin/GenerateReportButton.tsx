'use client';

import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { useState } from 'react';

interface Props {
  type: string;
  data?: any;
}

export default function GenerateReportButton({ type, data }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    
    setTimeout(() => {
      const doc = new jsPDF();
      const date = new Date().toLocaleDateString();
      
      doc.setFontSize(20);
      doc.setTextColor(183, 1, 0); // RedCross Red
      doc.text('RedCross Blood Bank', 14, 22);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Official ${type.charAt(0).toUpperCase() + type.slice(1)} Report`, 14, 32);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${date}`, 14, 40);
      
      doc.line(14, 45, 196, 45);

      if (type === 'inventory' && data) {
        doc.text(`Total Units: ${data.total || 0}`, 14, 55);
        doc.text(`Critical Shortages: O-, AB-`, 14, 65);
      } else if (type === 'admin' && data) {
        doc.text(`Total Donors: ${data.total || 0}`, 14, 55);
        doc.text(`Eligible Donors: ${data.eligible || 0}`, 14, 65);
      } else if (type === 'donors') {
        doc.text(`Donor Records Export`, 14, 55);
      }

      doc.save(`redcross-${type}-report-${new Date().toISOString().split('T')[0]}.pdf`);
      setLoading(false);
    }, 500); // simulate tiny delay for UX
  };

  return (
    <button 
      className="btn-outline flex items-center justify-center gap-2" 
      onClick={handleDownload}
      disabled={loading}
    >
      <Download size={16} />
      {loading ? 'Generating...' : 'Generate Report'}
    </button>
  );
}
