import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Expense, DailyBudget, FilterOptions, DayOfWeek } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_DAILY_BUDGET: DailyBudget = {
  monday: 50,
  tuesday: 50,
  wednesday: 50,
  thursday: 50,
  friday: 50,
  saturday: 30,
  sunday: 30
};

export const getDayOfWeek = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const startOfDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
};

const endOfDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
};

const startOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const diff = d.getDate() - d.getDay(); 
  return new Date(d.setDate(diff));
};

const endOfWeek = (date: Date): Date => {
  const start = startOfWeek(date);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 23, 59, 59, 999);
};

const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const calculateDailySpending = (expenses: Expense[], date: Date): number => {
  const todayStr = date.toISOString().split('T')[0]; 

  return expenses
    .filter((expense) => expense.date === todayStr)
    .reduce((total, expense) => total + expense.total, 0);
};


export const calculateWeeklySpending = (expenses: Expense[], date: Date): number => {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);

  return expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= weekStart && expenseDate <= weekEnd;
    })
    .reduce((total, expense) => total + expense.total, 0);
};

export const calculateMonthlySpending = (expenses: Expense[], date: Date): number => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  return expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    })
    .reduce((total, expense) => total + expense.total, 0);
};

export const filterExpenses = (expenses: Expense[], filters: FilterOptions): Expense[] => {
  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);

    if (filters.startDate && expenseDate < startOfDay(filters.startDate)) return false;
    if (filters.endDate && expenseDate > endOfDay(filters.endDate)) return false;
    if (filters.paymentMethod && filters.paymentMethod !== 'All' && expense.paymentMethod !== filters.paymentMethod) return false;
    if (filters.minAmount !== undefined && expense.total < filters.minAmount) return false;
    if (filters.maxAmount !== undefined && expense.total > filters.maxAmount) return false;

    return true;
  });
};

export const groupExpensesByDay = (expenses: Expense[]): Record<string, Expense[]> => {
  return expenses.reduce((grouped, expense) => {
    const date = formatDate(expense.date);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(expense);
    return grouped;
  }, {} as Record<string, Expense[]>);
};

export const getCurrentWeekDays = (): Date[] => {
  const today = new Date();
  const startDay = startOfWeek(today);

  return Array.from({ length: 7 }, (_, i) => addDays(startDay, i));
};

export const isOverBudget = (expenses: Expense[], date: Date, budget: DailyBudget): boolean => {
  const dayOfWeek = getDayOfWeek(date);
  const dailyBudget = budget[dayOfWeek];
  const dailySpending = calculateDailySpending(expenses, date);

  return dailySpending > dailyBudget;
};

export const calculateTotalSpending = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.total, 0);
};

export const calculateRemainingBudget = (expenses: Expense[], budget: DailyBudget): number => {
  const today = new Date();
  const dayOfWeek = getDayOfWeek(today);
  const dailyBudget = budget[dayOfWeek];
  const dailySpending = calculateDailySpending(expenses, today);

  return dailyBudget - dailySpending;
};

export const calculateBudgetPercentage = (expenses: Expense[], budget: DailyBudget): number => {
  const today = new Date();
  const dayOfWeek = getDayOfWeek(today);
  const dailyBudget = budget[dayOfWeek];
  const dailySpending = calculateDailySpending(expenses, today);

  if (dailyBudget === 0) return 0;
  return Math.min(100, (dailySpending / dailyBudget) * 100);
};
