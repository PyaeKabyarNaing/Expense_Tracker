import { type SQLiteDatabase } from 'expo-sqlite';
import { type Income, type CreateIncomeInput, DEFAULT_USER_ID } from '../types';

export async function createIncome(
  db: SQLiteDatabase,
  input: CreateIncomeInput
): Promise<number> {
  const now = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO incomes (user_id, amount, description, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [DEFAULT_USER_ID, input.amount, input.description ?? null, input.date, now, now]
  );
  return result.lastInsertRowId;
}

export async function getAllIncomes(db: SQLiteDatabase): Promise<Income[]> {
  return db.getAllAsync<Income>(
    'SELECT * FROM incomes WHERE user_id = ? ORDER BY date DESC, created_at DESC',
    [DEFAULT_USER_ID]
  );
}

export async function getTotalIncome(db: SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ total: number }>(
    'SELECT COALESCE(SUM(amount), 0) as total FROM incomes WHERE user_id = ?',
    [DEFAULT_USER_ID]
  );
  return result?.total ?? 0;
}
