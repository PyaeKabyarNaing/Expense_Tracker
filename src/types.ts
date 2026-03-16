export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Income {
  id: number;
  user_id: number;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseWithCategory extends Expense {
  category_name: string;
}

export interface Budget {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  type: 'income' | 'expense';
  id: number;
  amount: number;
  description: string | null;
  date: string;
  category_name?: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryBudgetSummary {
  budget: Budget | null;
  spent: number;
  remaining: number | null;
}

export interface CreateIncomeInput {
  amount: number;
  description?: string;
  date: string;
}

export interface CreateExpenseInput {
  categoryId: number;
  amount: number;
  description?: string;
  date: string;
}

export interface CreateBudgetInput {
  categoryId: number;
  amount: number;
  startDate: string;
  endDate: string;
}

export const DEFAULT_USER_ID = 1;
