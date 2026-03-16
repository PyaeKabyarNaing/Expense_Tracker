import { View, Text, StyleSheet } from 'react-native';
import { type Transaction } from '@/src/types';
import { formatCurrency } from '@/src/utils/currency';
import { formatDateShort } from '@/src/utils/dateUtils';

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  const accentColor = isIncome ? '#10B981' : '#EF4444';
  const sign = isIncome ? '+' : '-';

  return (
    <View style={styles.container}>
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.leftInfo}>
            <Text style={styles.type}>
              {isIncome ? 'Income' : transaction.category_name}
            </Text>
            {transaction.description ? (
              <Text style={styles.description} numberOfLines={1}>
                {transaction.description}
              </Text>
            ) : null}
          </View>
          <View style={styles.rightInfo}>
            <Text style={[styles.amount, { color: accentColor }]}>
              {sign}{formatCurrency(transaction.amount)}
            </Text>
            <Text style={styles.date}>{formatDateShort(transaction.date)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftInfo: {
    flex: 1,
    marginRight: 8,
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
  type: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});
