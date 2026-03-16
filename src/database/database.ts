import { type SQLiteDatabase } from 'expo-sqlite';
import { CREATE_TABLES_SQL, DEFAULT_CATEGORIES, DEFAULT_USER } from './schema';

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(CREATE_TABLES_SQL);

  const user = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM users LIMIT 1'
  );
  if (!user) {
    await db.runAsync(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [DEFAULT_USER.name, DEFAULT_USER.email]
    );
  }

  const categoryCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories'
  );
  if (!categoryCount || categoryCount.count === 0) {
    for (const name of DEFAULT_CATEGORIES) {
      await db.runAsync('INSERT INTO categories (name) VALUES (?)', [name]);
    }
  }
}
