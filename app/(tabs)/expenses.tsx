import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { type ExpenseWithCategory } from '@/src/types';
import { getAllExpenses } from '@/src/services/expenseService';
import { formatCurrency } from '@/src/utils/currency';
import { formatDate } from '@/src/utils/dateUtils';
import { EmptyState } from '@/src/components/EmptyState';

export default function ExpenseListScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);

  useFocusEffect(
    useCallback(() => {
      getAllExpenses(db).then(setExpenses);
    }, [db])
  );

  const renderItem = ({ item }: { item: ExpenseWithCategory }) => (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category_name}</Text>
          </View>
        </View>
        {item.description ? (
          <Text style={styles.itemDescription} numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
      </View>
      <Text style={styles.itemAmount}>-{formatCurrency(item.amount)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={
          expenses.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <EmptyState
            title="No expense records"
            message="Tap the + button to add your first expense."
          />
        }
      />
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/add-expense')}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemLeft: {
    flex: 1,
    marginRight: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  itemDescription: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
