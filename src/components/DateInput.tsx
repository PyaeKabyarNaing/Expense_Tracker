import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { formatDate, toDateString } from '@/src/utils/dateUtils';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
}

export function DateInput({ label, value, onChange }: DateInputProps) {
  const [show, setShow] = useState(false);
  const dateObj = new Date(value + 'T00:00:00');

  const handleChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate) {
      onChange(toDateString(selectedDate));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.input} onPress={() => setShow(true)}>
        <Text style={styles.dateText}>{formatDate(value)}</Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={dateObj}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
      {show && Platform.OS === 'ios' && (
        <Pressable style={styles.doneButton} onPress={() => setShow(false)}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
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
    backgroundColor: '#F8FAFC',
  },
  dateText: {
    fontSize: 16,
    color: '#0F172A',
  },
  doneButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
});
