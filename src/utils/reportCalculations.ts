// src/utils/reportCalculations.ts

/**
 * Calculates the Net Profit by subtracting both 
 * Expenses and Payroll from total Sales.
 */
export const calculateNetProfit = (sales: number, expenses: number, payroll: number): number => {
  return sales - expenses - payroll;
};

/**
 * Helper to sum numerical values from an array of objects.
 * Safely handles missing or non-numeric values by defaulting to 0.
 */
export const sumByField = <T>(data: T[], field: keyof T): number => {
  return data.reduce((sum, item) => {
    const val = item[field];
    return sum + (Number(val) || 0);
  }, 0);
};