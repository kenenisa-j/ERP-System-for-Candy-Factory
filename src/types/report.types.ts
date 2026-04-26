// src/types/report.types.ts

// 1. Core Data Interfaces
export interface SaleRecord {
  customer_name: string;
  quantity: number;
  total: number;
  date: string;
}

export interface ExpenseRecord {
  note: string;
  category: string;
  amount: number;
  date: string;
  created_by: string;
}

export interface ProductionRecord {
  product_name: string;
  quantity: number;
  date: string;
}

export interface PayrollRecord {
  worker_name: string;
  net_pay: number;
  status: 'paid' | 'pending';
  paid_at: string | null;
}

export interface AttendanceRecord {
  worker_name: string;
  present: number;
  absent: number;
  late: number;
}

// 2. The Main Report Structure (The "Blueprint" for the PDF)
export interface MonthlyReportData {
  summary: {
    totalSales: number;
    totalExpenses: number;
    totalPayroll: number;
    totalProductionUnits: number; // Total volume
    totalProductionRecords: number; // Total rows/count
    netProfit: number; // Formula: Sales - Expenses - Payroll
  };
  
  // Data for the detailed tables
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  production: ProductionRecord[];
  payroll: PayrollRecord[];
  attendance: AttendanceRecord[];
}