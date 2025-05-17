export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Pix' | 'Other';

export interface Expense {
  id: string;
  date: string; 
  item: string;
  value: number;
  quantity: number;
  paymentMethod: PaymentMethod;
  total: number; 
}

export interface DailyBudget {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

export type DayOfWeek = keyof DailyBudget;

export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: PaymentMethod | 'All';
  minAmount?: number;
  maxAmount?: number;
}