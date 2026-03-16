import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { type Income } from '@/src/types';
import { getAllIncomes } from '@/src/services/incomeService';
import { formatCurrency } from '@/src/utils/currency';
import { formatDate } from '@/src/utils/dateUtils';
import { EmptyState } from '@/src/components/EmptyState';

export default function IncomeListScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [incomes, setIncomes] = useState<Income[]>([]);

  useFocusEffect(
    useCallback(() => {
      getAllIncomes(db).then(setIncomes);
    }, [db])
  );

  const renderItem = ({ item }: { item: Income }) => (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
        {item.description ? (
          <Text style={styles.itemDescription} numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
      </View>
      <Text style={styles.itemAmount}>+{formatCurrency(item.amount)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={
          incomes.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <EmptyState
            title="No income records"
            message="Tap the + button to add your first income."
          />
        }
      />
      <Pressable style={styles.fab} onPress={() => router.push('/add-income')}>
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
    borderLeftColor: '#10B981',
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
  itemDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  itemDescription: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
