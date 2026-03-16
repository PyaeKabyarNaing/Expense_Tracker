import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { type Category } from '@/src/types';
import { createBudget } from '@/src/services/budgetService';
import { getCategories } from '@/src/services/categoryService';
import { DateInput } from '@/src/components/DateInput';
import { CategoryPicker } from '@/src/components/CategoryPicker';
import { getCurrentDate } from '@/src/utils/dateUtils';

function getMonthEnd(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  const m = String(lastDay.getMonth() + 1).padStart(2, '0');
  const day = String(lastDay.getDate()).padStart(2, '0');
  return `${lastDay.getFullYear()}-${m}-${day}`;
}

function getMonthStart(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

export default function BudgetScreen() {
  const db = useSQLiteContext();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState(getMonthStart());
  const [endDate, setEndDate] = useState(getMonthEnd());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories(db).then(setCategories);
  }, [db]);

  const handleSubmit = async () => {
    if (!categoryId) {
      Alert.alert('Validation Error', 'Please select a category.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount < 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount (0 or greater).');
      return;
    }
    if (!startDate || !endDate) {
      Alert.alert('Validation Error', 'Please select start and end dates.');
      return;
    }
    if (startDate > endDate) {
      Alert.alert('Validation Error', 'Start date must be before or equal to end date.');
      return;
    }

    setSubmitting(true);
    try {
      await createBudget(db, {
        categoryId,
        amount: parsedAmount,
        startDate,
        endDate,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save budget. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <CategoryPicker
            label="Category *"
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />

          <Text style={styles.label}>Budget Amount *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          <DateInput
            label="Start Date *"
            value={startDate}
            onChange={setStartDate}
          />

          <DateInput
            label="End Date *"
            value={endDate}
            onChange={setEndDate}
          />
        </View>

        <Pressable
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>
            {submitting ? 'Saving...' : 'Set Budget'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
