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

  /**
   * Orchestrates the report generation flow:
   * 1. Fetch data from Service Layer
   * 2. Generate PDF via Generator Layer
   */
  const handleDownload = async () => {
    setIsExporting(true);
    try {
      // 1. Fetch structured data
      const reportData = await reportService.getMonthlyReport(month, year);
      
      // 2. Format month name for PDF title
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
      
      // 3. Trigger PDF generation
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
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isExporting 
          ? 'bg-gray-400 cursor-not-allowed shadow-none' 
          : 'bg-gray-800 hover:bg-black text-white shadow-md hover:shadow-lg'
      }`}
    >
      {isExporting ? 'Generating Report...' : 'Download Monthly Report'}
    </button>
  );
}