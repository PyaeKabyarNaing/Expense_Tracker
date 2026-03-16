import { type SQLiteDatabase } from 'expo-sqlite';
import { type Category } from '../types';

export async function getCategories(db: SQLiteDatabase): Promise<Category[]> {
  return db.getAllAsync<Category>('SELECT * FROM categories ORDER BY name ASC');
}

export async function createCategory(
  db: SQLiteDatabase,
  name: string
): Promise<number> {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Category name is required');
  }

  const now = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO categories (name, created_at, updated_at) VALUES (?, ?, ?)',
    [trimmed, now, now]
  );
  return result.lastInsertRowId;
}

export async function updateCategory(
  db: SQLiteDatabase,
  id: number,
  name: string
): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Category name is required');
  }

  const now = new Date().toISOString();
  await db.runAsync(
    'UPDATE categories SET name = ?, updated_at = ? WHERE id = ?',
    [trimmed, now, id]
  );
}

export async function deleteCategory(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
}
