import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '@/src/utils/currency';

interface SummaryCardProps {
  label: string;
  amount: number;
  color: string;
  backgroundColor: string;
}

export function SummaryCard({ label, amount, color, backgroundColor }: SummaryCardProps) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
      <Text style={[styles.amount, { color }]}>{formatCurrency(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.8,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
  },
});
