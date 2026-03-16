import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { type Category } from '@/src/types';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/src/services/categoryService';
import { EmptyState } from '@/src/components/EmptyState';

export default function CategoriesScreen() {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const cats = await getCategories(db);
    setCategories(cats);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) {
      Alert.alert('Validation', 'Category name is required.');
      return;
    }

    setSubmitting(true);
    try {
      await createCategory(db, name);
      setNewName('');
      await load();
    } catch (e: any) {
      if (String(e?.message).includes('UNIQUE')) {
        Alert.alert(
          'Duplicate name',
          'A category with this name already exists.'
        );
      } else {
        Alert.alert('Error', 'Failed to add category.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const name = editingName.trim();
    if (!name) {
      Alert.alert('Validation', 'Category name is required.');
      return;
    }

    setSubmitting(true);
    try {
      await updateCategory(db, editingId, name);
      cancelEdit();
      await load();
    } catch (e: any) {
      if (String(e?.message).includes('UNIQUE')) {
        Alert.alert(
          'Duplicate name',
          'A category with this name already exists.'
        );
      } else {
        Alert.alert('Error', 'Failed to update category.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (cat: Category) => {
    Alert.alert(
      'Delete category?',
      'If this category is used by any expenses or budgets, it cannot be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(cat.id),
        },
      ]
    );
  };

  const handleDelete = async (id: number) => {
    setSubmitting(true);
    try {
      await deleteCategory(db, id);
      if (editingId === id) {
        cancelEdit();
      }
      await load();
    } catch {
      Alert.alert(
        'Cannot delete',
        'This category is used by existing expenses or budgets and cannot be deleted.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: Category }) => {
    const isEditing = editingId === item.id;

    return (
      <View style={styles.item}>
        <View style={styles.itemLeft}>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={editingName}
              onChangeText={setEditingName}
              autoFocus
            />
          ) : (
            <Text style={styles.itemName}>{item.name}</Text>
          )}
        </View>
        <View style={styles.actions}>
          {isEditing ? (
            <>
              <Pressable
                style={styles.iconButton}
                onPress={handleSaveEdit}
                disabled={submitting}
              >
                <Ionicons name="checkmark" size={20} color="#10B981" />
              </Pressable>
              <Pressable style={styles.iconButton} onPress={cancelEdit}>
                <Ionicons name="close" size={20} color="#9CA3AF" />
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={styles.iconButton}
                onPress={() => startEdit(item)}
              >
                <Ionicons name="create-outline" size={20} color="#3B82F6" />
              </Pressable>
              <Pressable
                style={styles.iconButton}
                onPress={() => confirmDelete(item)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </Pressable>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.addRow}>
        <TextInput
          style={styles.addInput}
          placeholder="New category name"
          placeholderTextColor="#9CA3AF"
          value={newName}
          onChangeText={setNewName}
        />
        <Pressable
          style={[
            styles.addButton,
            (submitting || !newName.trim()) && styles.addButtonDisabled,
          ]}
          onPress={handleAdd}
          disabled={submitting || !newName.trim()}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={
          categories.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <EmptyState
            title="No categories"
            message="Add your first category above. Default ones appear here too and can be edited."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  addRow: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    gap: 8,
  },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: '#111827',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#F9FAFB',
    fontSize: 15,
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginLeft: 4,
  },
});

