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

/**
 * Aggregates attendance records by worker, counting Present, Absent, and Late.
 */
// src/utils/reportCalculations.ts

export const aggregateAttendance = (data: any[]) => {
  const grouped = data.reduce((acc, item) => {
    // Correctly accessing the joined worker name
    const name = item.workers?.full_name || item.worker_name || "Unknown";
    
    if (!acc[name]) {
      acc[name] = { workerName: name, Present: 0, Absent: 0, Late: 0 };
    }
    
    // Normalize status (handling cases where it might be lowercase or capitalized)
    const status = item.status?.charAt(0).toUpperCase() + item.status?.slice(1).toLowerCase();
    
    if (status === 'Present') acc[name].Present += 1;
    else if (status === 'Absent') acc[name].Absent += 1;
    else if (status === 'Late') acc[name].Late += 1;
    
    return acc;
  }, {} as Record<string, any>);
  
  // Sort alphabetically by worker name for a clean professional report
  return Object.values(grouped).sort((a: any, b: any) => 
    a.workerName.localeCompare(b.workerName)
  );
};

/**
 * Aggregates production records by Product Name and Date,
 * summing quantities for identical products produced on the same day.
 */
export const aggregateProduction = (data: any[]) => {
  const grouped = data.reduce((acc, item) => {
    const date = item.date || "Unknown";
    const product = item.product_name || "Unknown";
    const key = `${product}-${date}`;
    
    if (!acc[key]) {
      acc[key] = { productName: product, date, quantity: 0 };
    }
    acc[key].quantity += Number(item.quantity) || 0;
    return acc;
  }, {} as Record<string, any>);
  
  return Object.values(grouped);
};