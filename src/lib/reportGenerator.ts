// src/lib/reportGenerator.ts
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { MonthlyReportData } from '@/types/report.types';

const generateTable = (doc: jsPDF, options: UserOptions): number => {
  autoTable(doc, {
    ...options,
    headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 25 },
  });
  const finalY = (doc as any).lastAutoTable.finalY;
  return typeof finalY === 'number' ? finalY : 25;
};

// Colorful Summary Card Helper
const drawSummaryCard = (doc: jsPDF, y: number, title: string, items: { label: string; val: string }[], color: [number, number, number]) => {
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(14, y, 182, 18, 'F');
  doc.setTextColor(255);
  doc.setFontSize(10);
  doc.text(title.toUpperCase(), 20, y + 7);
  
  doc.setFontSize(11);
  items.forEach((item, index) => {
    doc.text(`${item.label}: ${item.val}`, 20 + (index * 60), y + 14);
  });
  doc.setTextColor(0);
};

const drawSummaryBox = (doc: jsPDF, y: number, label: string, value: string) => {
  doc.setDrawColor(52, 73, 94);
  doc.rect(14, y, 182, 10);
  doc.setFontSize(10);
  doc.setTextColor(52, 73, 94);
  doc.text(label, 20, y + 7);
  doc.text(value, 150, y + 7);
  doc.setTextColor(0);
};

// src/lib/reportGenerator.ts
// ... (keep imports and helper functions as they are)

export const generateMonthlyReport = (data: MonthlyReportData, monthName: string, year: number) => {
  const doc = new jsPDF();
  const formatCurrency = (val: number) => (val || 0).toLocaleString('en-ET', { style: 'currency', currency: 'ETB' });

  // COVER
  doc.setFillColor(52, 73, 94);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255);
  doc.setFontSize(22);
  doc.text('CANDY FACTORY MANAGEMENT REPORT', 14, 25);
  doc.setFontSize(14);
  doc.text(`${monthName.toUpperCase()} ${year}`, 14, 35);
  
  // 1. EXECUTIVE SUMMARY (Updated to be colorful and consistent)
  doc.setTextColor(0);
  doc.setFontSize(16);
  doc.text('1. EXECUTIVE SUMMARY', 14, 50);
  
  const execY = generateTable(doc, {
    startY: 55,
    head: [['Metric', 'Amount']],
    // Now colorful, matching your other tables
    headStyles: { fillColor: [39, 174, 96], textColor: [255, 255, 255] },
    body: [
      ['Total Sales', formatCurrency(data.summary.totalSales)],
      ['Total Expenses', formatCurrency(data.summary.totalExpenses)],
      ['Total Payroll', formatCurrency(data.summary.totalPayroll)],
      ['Net Profit', formatCurrency(data.summary.netProfit)],
    ]
  });
  
  // Highlighting the Net Profit box below
  drawSummaryCard(doc, execY + 5, 'NET PROFIT FOR MONTH', [
    { label: 'Result', val: formatCurrency(data.summary.netProfit) }
  ], [39, 174, 96]);

  // ... (Rest of your sections 2-6 remain exactly as before)
  // 2. SALES
  doc.addPage();
  doc.text('2. SALES REPORT', 14, 20);
  const salesY = generateTable(doc, { startY: 25, head: [['Customer', 'Qty', 'Amount', 'Date']], body: data.sales.map(s => [s.customer_name, s.quantity, formatCurrency(s.total), s.date]) });
  drawSummaryCard(doc, salesY + 5, 'SALES SUMMARY', [
    { label: 'Orders', val: data.sales.length.toString() },
    { label: 'Total Qty', val: data.summary.totalProductionUnits.toString() },
    { label: 'Total Sales', val: formatCurrency(data.summary.totalSales) }
  ], [41, 128, 185]); // Blue

  // 3. EXPENSES
  doc.addPage();
  doc.text('3. EXPENSE REPORT', 14, 20);
  const expY = generateTable(doc, { startY: 25, head: [['Note', 'Category', 'Amount', 'Date']], body: data.expenses.map(e => [e.note, e.category, formatCurrency(e.amount), e.date]) });
  drawSummaryCard(doc, expY + 5, 'EXPENSE SUMMARY', [
    { label: 'Records', val: data.expenses.length.toString() },
    { label: 'Total', val: formatCurrency(data.summary.totalExpenses) }
  ], [192, 57, 43]); // Red

  // 4. PRODUCTION
  doc.addPage();
  doc.text('4. PRODUCTION REPORT', 14, 20);
  const prodY = generateTable(doc, { startY: 25, head: [['Product', 'Quantity', 'Date']], body: data.production.map(p => [p.product_name, p.quantity, p.date]) });
  drawSummaryCard(doc, prodY + 5, 'PRODUCTION SUMMARY', [
    { label: 'Entries', val: data.summary.totalProductionRecords.toString() },
    { label: 'Units', val: data.summary.totalProductionUnits.toString() }
  ], [243, 156, 18]); // Orange

  // 5. PAYROLL
  doc.addPage();
  doc.text('5. PAYROLL REPORT', 14, 20);
  const payY = generateTable(doc, { startY: 25, head: [['Worker', 'Net Pay', 'Status', 'Paid At']], body: data.payroll.map(p => [p.worker_name, formatCurrency(p.net_pay), p.status, p.paid_at || '-']) });
  drawSummaryCard(doc, payY + 5, 'PAYROLL SUMMARY', [
    { label: 'Paid', val: data.payroll.filter(p => p.status === 'paid').length.toString() },
    { label: 'Pending', val: data.payroll.filter(p => p.status === 'pending').length.toString() },
    { label: 'Total', val: formatCurrency(data.summary.totalPayroll) }
  ], [142, 68, 173]); // Purple

  // 6. ATTENDANCE
  doc.addPage();
  doc.text('6. ATTENDANCE SUMMARY', 14, 20);
  const attY = generateTable(doc, { startY: 25, head: [['Worker', 'Present', 'Absent', 'Late']], body: data.attendance.map(a => [a.worker_name, a.present, a.absent, a.late]) });
  drawSummaryCard(doc, attY + 5, 'ATTENDANCE SUMMARY', [
    { label: 'Present', val: data.attendance.reduce((sum, a) => sum + a.present, 0).toString() },
    { label: 'Absent', val: data.attendance.reduce((sum, a) => sum + a.absent, 0).toString() },
    { label: 'Late', val: data.attendance.reduce((sum, a) => sum + a.late, 0).toString() }
  ], [39, 174, 96]); // Green

  doc.save(`Candy-Factory-${monthName}-${year}-Report.pdf`);
};