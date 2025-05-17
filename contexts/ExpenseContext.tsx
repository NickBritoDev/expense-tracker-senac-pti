import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, DailyBudget, FilterOptions, PaymentMethod } from '@/lib/types';
import { DEFAULT_DAILY_BUDGET } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  editExpense: (id: string, expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  dailyBudget: DailyBudget;
  updateDailyBudget: (budget: DailyBudget) => void;
  filteredExpenses: Expense[];
  setFilterOptions: (options: FilterOptions) => void;
  filterOptions: FilterOptions;
  clearFilters: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [dailyBudget, setDailyBudget] = useLocalStorage<DailyBudget>('dailyBudget', DEFAULT_DAILY_BUDGET);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    paymentMethod: 'All',
  });
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses);

  
  useEffect(() => {
    let result = [...expenses];
    
    
    if (filterOptions.startDate) {
      result = result.filter(expense => new Date(expense.date) >= filterOptions.startDate!);
    }
    
    if (filterOptions.endDate) {
      const endOfDay = new Date(filterOptions.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      result = result.filter(expense => new Date(expense.date) <= endOfDay);
    }
    
    
    if (filterOptions.paymentMethod && filterOptions.paymentMethod !== 'All') {
      result = result.filter(expense => expense.paymentMethod === filterOptions.paymentMethod);
    }
    
    
    if (filterOptions.minAmount !== undefined) {
      result = result.filter(expense => expense.total >= filterOptions.minAmount!);
    }
    
    if (filterOptions.maxAmount !== undefined) {
      result = result.filter(expense => expense.total <= filterOptions.maxAmount!);
    }
    
    
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredExpenses(result);
  }, [expenses, filterOptions]);
  
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: uuidv4()
    };
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
  };
  
  const editExpense = (id: string, expense: Omit<Expense, 'id'>) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(item => 
        item.id === id ? { ...expense, id } : item
      )
    );
  };
  
  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };
  
  const updateDailyBudget = (budget: DailyBudget) => {
    setDailyBudget(budget);
  };
  
  const clearFilters = () => {
    setFilterOptions({
      paymentMethod: 'All',
    });
  };
  
  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        editExpense,
        deleteExpense,
        dailyBudget,
        updateDailyBudget,
        filteredExpenses,
        setFilterOptions,
        filterOptions,
        clearFilters
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}