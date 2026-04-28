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
  // 1. ALL HOOKS MUST BE CALLED AT THE TOP
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null); 
  
  const { user, loading: authLoading } = useAuth();
  const { range, setRange, startDate, endDate } = useTableFilters();
  const isMounted = useRef(true);

  // 2. NOW you can define your logic
  const isAdmin = user?.role === 'superadmin' || user?.role === 'owner';
  const isAccountDisabled = user && user.is_active === false && !isAdmin;

  const fetchExpenses = async () => {
    if (!isMounted.current || (user?.is_active === false && !isAdmin)) return;
    
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
    if (!authLoading && user && !isAccountDisabled) fetchExpenses();
    else if (!authLoading) setLoading(false);
    return () => { isMounted.current = false; };
  }, [user, authLoading, range, isAccountDisabled]);

  const canEdit = (expense: any) => {
    return user?.role === 'superadmin' || expense.created_by === user?.id;
  };

  const handleEditClick = (expense: any) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    if (isAccountDisabled) {
      alert("Your account is disabled. You cannot perform this action.");
      return;
    }
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  // 3. RENDER LOGIC
  if (authLoading || (loading && expenses.length === 0 && !isAccountDisabled)) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchExpenses} />;
  
  if (isAccountDisabled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md w-full">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-900">Account Disabled</h2>
          <p className="text-gray-500 mt-2">Your account is currently disabled. Please contact your administrator to regain access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <ModuleSummaryHeader 
          title="Expenses" 
          isAdmin={isAdmin}
          stats={[
            { label: "Total Expenses", value: `${totalAmount.toLocaleString()} Birr` },
            { label: "Records", value: expenses.length }
          ]}
          filterComponent={<DateFilters range={range} onChange={setRange} />}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-gray-700">Recent Transactions</h3>
            <button 
              onClick={handleAddClick}
              className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
            >
              + Add Expense
            </button>
          </div>
          
          <div className="overflow-x-auto w-full">
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
    </div>
  );
}