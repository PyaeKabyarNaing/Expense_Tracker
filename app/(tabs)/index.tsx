import { CategoryBudgetCard } from '@/src/components/CategoryBudgetCard';
import { CategoryPicker } from '@/src/components/CategoryPicker';
import { EmptyState } from '@/src/components/EmptyState';
import { SummaryCard } from '@/src/components/SummaryCard';
import { TransactionItem } from '@/src/components/TransactionItem';
import { getCategories } from '@/src/services/categoryService';
import {
  getCategoryBudgetSummary,
  getDashboardSummary,
  getRecentTransactions,
  getTotalActiveBudgetAmount,
} from '@/src/services/dashboardService';
import {
  type Category,
  type CategoryBudgetSummary,
  type DashboardSummary,
  type Transaction,
} from '@/src/types';
import { formatCurrency } from '@/src/utils/currency';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useRef, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function DashboardScreen() {
  const db = useSQLiteContext();
  const router = useRouter();

  const [summary, setSummary] = useState<DashboardSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [budgetSummary, setBudgetSummary] =
    useState<CategoryBudgetSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [totalActiveBudget, setTotalActiveBudget] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const selectedCatRef = useRef<number | null>(null);

  const loadDashboard = useCallback(async () => {
    const [dashSummary, cats, transactions, activeBudgetTotal] =
      await Promise.all([
        getDashboardSummary(db),
        getCategories(db),
        getRecentTransactions(db, 10),
        getTotalActiveBudgetAmount(db),
      ]);

    setSummary(dashSummary);
    setCategories(cats);
    setRecentTransactions(transactions);
    setTotalActiveBudget(activeBudgetTotal);

    const catId = selectedCatRef.current ?? cats[0]?.id ?? null;
    if (catId) {
      selectedCatRef.current = catId;
      setSelectedCategoryId(catId);
      const budgetSum = await getCategoryBudgetSummary(db, catId);
      setBudgetSummary(budgetSum);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const handleCategorySelect = useCallback(
    async (categoryId: number) => {
      selectedCatRef.current = categoryId;
      setSelectedCategoryId(categoryId);
      const budgetSum = await getCategoryBudgetSummary(db, categoryId);
      setBudgetSummary(budgetSum);
    },
    [db]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  }, [loadDashboard]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const budgetTotal = Number(totalActiveBudget) || 0;
  const balanceTotal = Number(summary.balance) || 0;
  const isTotalBudgetOverBalance = budgetTotal > 0 && budgetTotal > balanceTotal;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3B82F6"
        />
      }
    >
      <View style={styles.summaryRow}>
        <SummaryCard
          label="Income"
          amount={summary.totalIncome}
          color="#10B981"
          backgroundColor="#ECFDF5"
        />
        <SummaryCard
          label="Expenses"
          amount={summary.totalExpense}
          color="#EF4444"
          backgroundColor="#FEF2F2"
        />
      </View>

      {isTotalBudgetOverBalance && (
        <View style={styles.globalWarning}>
          <Text style={styles.globalWarningTitle}>Budgets exceed balance</Text>
          <Text style={styles.globalWarningText}>
            Your total active budgets are higher than your current balance. Adjust
            budgets or increase income until your balance exceeds the total
            budgeted amount.
          </Text>
        </View>
      )}

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text
          style={[
            styles.balanceAmount,
            { color: summary.balance >= 0 ? '#10B981' : '#EF4444' },
          ]}
        >
          {formatCurrency(summary.balance)}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: '#ECFDF5' }]}
          onPress={() => router.push('/add-income')}
        >
          <Ionicons name="add-circle" size={20} color="#10B981" />
          <Text style={[styles.actionText, { color: '#10B981' }]}>Income</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, { backgroundColor: '#FEF2F2' }]}
          onPress={() => router.push('/add-expense')}
        >
          <Ionicons name="remove-circle" size={20} color="#EF4444" />
          <Text style={[styles.actionText, { color: '#EF4444' }]}>
            Expense
          </Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, { backgroundColor: '#EFF6FF' }]}
          onPress={() => router.push('/budget')}
        >
          <Ionicons name="wallet" size={20} color="#3B82F6" />
          <Text style={[styles.actionText, { color: '#3B82F6' }]}>Budget</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Category Budget</Text>
      <CategoryPicker
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={handleCategorySelect}
      />
      {budgetSummary && selectedCategory ? (
        <CategoryBudgetCard
          categoryName={selectedCategory.name}
          summary={budgetSummary}
        />
      ) : null}

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
        Recent Transactions
      </Text>
      {recentTransactions.length > 0 ? (
        recentTransactions.map((t) => (
          <TransactionItem key={`${t.type}-${t.id}`} transaction={t} />
        ))
      ) : (
        <EmptyState
          title="No transactions yet"
          message="Add your first income or expense to get started."
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 4,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  globalWarning: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FBBF24',
  },
  globalWarningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  globalWarningText: {
    fontSize: 13,
    color: '#92400E',
  },
});
