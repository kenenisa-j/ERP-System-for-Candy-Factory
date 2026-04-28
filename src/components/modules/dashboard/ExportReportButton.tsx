'use client';

import { useState } from 'react';
import { reportService } from '@/services/report.service';
import { generateMonthlyReport } from '@/lib/reportGenerator';

interface ExportButtonProps {
  month: number;
  year: number;
}

export default function ExportReportButton({ month, year }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const reportData = await reportService.getMonthlyReport(month, year);
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
      
      generateMonthlyReport(reportData, monthName, year);
    } catch (error) {
      console.error("Export Error:", error);
      alert("Failed to generate report. Please check the browser console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isExporting}
      className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
        isExporting 
          ? 'bg-gray-400 cursor-not-allowed shadow-none' 
          : 'bg-gray-800 hover:bg-black text-white shadow-md hover:shadow-lg'
      }`}
    >
      {isExporting ? 'Generating...' : 'Export PDF'}
    </button>
  );
}