import { View, Text, StyleSheet } from 'react-native';
import { type CategoryBudgetSummary } from '@/src/types';
import { formatCurrency } from '@/src/utils/currency';
import { formatDate } from '@/src/utils/dateUtils';
import { calculateBudgetProgress, isOverBudget } from '@/src/utils/calculations';

interface CategoryBudgetCardProps {
  categoryName: string;
  summary: CategoryBudgetSummary;
}

export function CategoryBudgetCard({ categoryName, summary }: CategoryBudgetCardProps) {
  const { budget, spent, remaining } = summary;

  if (!budget) {
    return (
      <View style={styles.card}>
        <Text style={styles.categoryName}>{categoryName}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Spent</Text>
          <Text style={styles.spentAmount}>{formatCurrency(spent)}</Text>
        </View>
        <Text style={styles.noBudget}>No budget set for this category</Text>
      </View>
    );
  }

  const progress = calculateBudgetProgress(budget.amount, spent);
  const over = isOverBudget(budget.amount, spent);
  const barColor = over ? '#EF4444' : progress > 0.75 ? '#F59E0B' : '#10B981';

  return (
    <View style={styles.card}>
      <Text style={styles.categoryName}>{categoryName}</Text>
      <Text style={styles.dateRange}>
        {formatDate(budget.start_date)} — {formatDate(budget.end_date)}
      </Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress * 100, 100)}%`,
                backgroundColor: barColor,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Budget</Text>
          <Text style={styles.statValue}>{formatCurrency(budget.amount)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Spent</Text>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>
            {formatCurrency(spent)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Remaining</Text>
          <Text
            style={[
              styles.statValue,
              { color: over ? '#EF4444' : '#10B981' },
            ]}
          >
            {remaining !== null ? formatCurrency(remaining) : '—'}
          </Text>
        </View>
      </View>

      {over && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            Over budget by {formatCurrency(Math.abs(remaining!))}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  dateRange: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
  },
  spentAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
  },
  noBudget: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  warningBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  warningText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
});
