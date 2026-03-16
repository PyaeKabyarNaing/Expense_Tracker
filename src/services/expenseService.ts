import { type SQLiteDatabase } from 'expo-sqlite';
import { type ExpenseWithCategory, type CreateExpenseInput, DEFAULT_USER_ID } from '../types';

export async function createExpense(
  db: SQLiteDatabase,
  input: CreateExpenseInput
): Promise<number> {
  const now = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO expenses (user_id, category_id, amount, description, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [DEFAULT_USER_ID, input.categoryId, input.amount, input.description ?? null, input.date, now, now]
  );
  return result.lastInsertRowId;
}

export async function getAllExpenses(
  db: SQLiteDatabase
): Promise<ExpenseWithCategory[]> {
  return db.getAllAsync<ExpenseWithCategory>(
    `SELECT e.*, c.name as category_name
     FROM expenses e
     JOIN categories c ON e.category_id = c.id
     WHERE e.user_id = ?
     ORDER BY e.date DESC, e.created_at DESC`,
    [DEFAULT_USER_ID]
  );
}

export async function getTotalExpense(db: SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ total: number }>(
    'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE user_id = ?',
    [DEFAULT_USER_ID]
  );
  return result?.total ?? 0;
}

export async function getCategorySpent(
  db: SQLiteDatabase,
  categoryId: number,
  startDate?: string,
  endDate?: string
): Promise<number> {
  let query =
    'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE user_id = ? AND category_id = ?';
  const params: (string | number)[] = [DEFAULT_USER_ID, categoryId];

  if (startDate && endDate) {
    query += ' AND date >= ? AND date <= ?';
    params.push(startDate, endDate);
  }

  const result = await db.getFirstAsync<{ total: number }>(query, params);
  return result?.total ?? 0;
}
