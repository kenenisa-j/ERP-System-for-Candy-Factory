'use client';
import { useEffect, useState, useRef } from 'react';
import { expensesService } from '@/services/expenses.service';
import ExpenseForm from '@/components/modules/expenses/ExpenseForm';
import ExpensesTable from '@/components/modules/expenses/ExpensesTable';
import Loading from '@/components/shared/Loading';
import ErrorMessage from '@/components/shared/ErrorMessage';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useTableFilters } from '@/hooks/useTableFilters';
import DateFilters from '@/components/shared/DateFilter';
import ModuleSummaryHeader from '@/components/shared/ModuleSummaryHeader';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null); 
  
  const { user, loading: authLoading } = useAuth();
  const { range, setRange, startDate, endDate } = useTableFilters();
  const isMounted = useRef(true);

  // Define admin status
  const isAdmin = user?.role === 'superadmin' || user?.role === 'owner';

  const fetchExpenses = async () => {
    if (!isMounted.current) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await expensesService.getAll(startDate, endDate);
      if (isMounted.current) {
        setExpenses(data.expenses || []);
        setTotalAmount(data.totalAmount || 0);
      }
    } catch (err) {
      if (isMounted.current) setError("Failed to load expenses.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    if (!authLoading && user) fetchExpenses();
    else if (!authLoading) setLoading(false);
    return () => { isMounted.current = false; };
  }, [user, authLoading, range]);

  const canEdit = (expense: any) => {
    return user?.role === 'superadmin' || expense.created_by === user?.id;
  };

  const handleEditClick = (expense: any) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  if (loading || authLoading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchExpenses} />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Modern Header Section - Stats hidden for non-admins */}
      <ModuleSummaryHeader 
        title="Expenses" 
        isAdmin={isAdmin}
        stats={[
          { label: "Total Expenses", value: `${totalAmount.toLocaleString()} Birr` },
          { label: "Records", value: expenses.length }
        ]}
        filterComponent={<DateFilters range={range} onChange={setRange} />}
      />

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">Recent Transactions</h3>
          <button 
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            + Add Expense
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <ExpensesTable 
            expenses={expenses} 
            onEdit={handleEditClick} 
            canEdit={canEdit} 
          />
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <ExpenseForm 
            initialData={editingExpense} 
            onSuccess={() => { setIsModalOpen(false); fetchExpenses(); }} 
          />
        </Modal>
      )}
    </div>
  );
}