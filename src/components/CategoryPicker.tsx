import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { type Category } from '@/src/types';

interface CategoryPickerProps {
  label?: string;
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function CategoryPicker({
  label,
  categories,
  selectedId,
  onSelect,
}: CategoryPickerProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            style={[styles.chip, selectedId === cat.id && styles.chipSelected]}
            onPress={() => onSelect(cat.id)}
          >
            <Text
              style={[
                styles.chipText,
                selectedId === cat.id && styles.chipTextSelected,
              ]}
            >
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  scrollContent: {
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});
