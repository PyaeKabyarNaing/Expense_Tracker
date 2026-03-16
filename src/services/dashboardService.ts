import { type SQLiteDatabase } from 'expo-sqlite';
import {
  type CategoryBudgetSummary,
  type DashboardSummary,
  DEFAULT_USER_ID,
  type Transaction,
} from '../types';
import { calculateBalance, calculateRemainingBudget } from '../utils/calculations';
import { getSelectedBudgetByCategory } from './budgetService';
import { getCategorySpent, getTotalExpense } from './expenseService';
import { getTotalIncome } from './incomeService';

export async function getDashboardSummary(
  db: SQLiteDatabase
): Promise<DashboardSummary> {
  const [totalIncome, totalExpense] = await Promise.all([
    getTotalIncome(db),
    getTotalExpense(db),
  ]);
  const balance = calculateBalance(totalIncome, totalExpense);
  return { totalIncome, totalExpense, balance };
}

export async function getTotalActiveBudgetAmount(
  db: SQLiteDatabase
): Promise<number> {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayString = `${year}-${month}-${day}`;

  const result = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(latest_amount), 0) as total
     FROM (
       SELECT amount as latest_amount
       FROM budgets b1
       WHERE b1.user_id = ?
         AND b1.start_date <= ?
         AND b1.end_date >= ?
         AND b1.created_at = (
           SELECT MAX(b2.created_at)
           FROM budgets b2
           WHERE b2.user_id = b1.user_id
             AND b2.category_id = b1.category_id
         )
     )`,
    [DEFAULT_USER_ID, todayString, todayString]
  );

  return Number(result?.total) || 0;
}

export async function getCategoryBudgetSummary(
  db: SQLiteDatabase,
  categoryId: number
): Promise<CategoryBudgetSummary> {
  const budget = await getSelectedBudgetByCategory(db, categoryId);

  const spent = await getCategorySpent(
    db,
    categoryId,
    budget?.start_date,
    budget?.end_date
  );

  const remaining = budget
    ? calculateRemainingBudget(budget.amount, spent)
    : null;

  return { budget, spent, remaining };
}

export async function getRecentTransactions(
  db: SQLiteDatabase,
  limit: number = 10
): Promise<Transaction[]> {
  const [incomes, expenses] = await Promise.all([
    db.getAllAsync<{
      id: number;
      amount: number;
      description: string | null;
      date: string;
    }>(
      'SELECT id, amount, description, date FROM incomes WHERE user_id = ? ORDER BY date DESC LIMIT ?',
      [DEFAULT_USER_ID, limit]
    ),
    db.getAllAsync<{
      id: number;
      amount: number;
      description: string | null;
      date: string;
      category_name: string;
    }>(
      `SELECT e.id, e.amount, e.description, e.date, c.name as category_name
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.user_id = ?
       ORDER BY e.date DESC LIMIT ?`,
      [DEFAULT_USER_ID, limit]
    ),
  ]);

  const transactions: Transaction[] = [
    ...incomes.map((i) => ({ type: 'income' as const, ...i })),
    ...expenses.map((e) => ({ type: 'expense' as const, ...e })),
  ];

  transactions.sort((a, b) => b.date.localeCompare(a.date));

  return transactions.slice(0, limit);
}
