import { type SQLiteDatabase } from 'expo-sqlite';
import { type Budget, type CreateBudgetInput, DEFAULT_USER_ID } from '../types';

export async function createBudget(
  db: SQLiteDatabase,
  input: CreateBudgetInput
): Promise<number> {
  const now = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO budgets (user_id, category_id, amount, start_date, end_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [DEFAULT_USER_ID, input.categoryId, input.amount, input.startDate, input.endDate, now, now]
  );
  return result.lastInsertRowId;
}

export async function getBudgets(db: SQLiteDatabase): Promise<Budget[]> {
  return db.getAllAsync<Budget>(
    'SELECT * FROM budgets WHERE user_id = ? ORDER BY created_at DESC',
    [DEFAULT_USER_ID]
  );
}

export async function getSelectedBudgetByCategory(
  db: SQLiteDatabase,
  categoryId: number
): Promise<Budget | null> {
  return db.getFirstAsync<Budget>(
    'SELECT * FROM budgets WHERE user_id = ? AND category_id = ? ORDER BY created_at DESC LIMIT 1',
    [DEFAULT_USER_ID, categoryId]
  );
}
