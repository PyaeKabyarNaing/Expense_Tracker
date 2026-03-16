import { Suspense } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '@/src/database/database';

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}

export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SQLiteProvider databaseName="clearspend.db" onInit={initializeDatabase}>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="add-income"
            options={{
              headerShown: true,
              title: 'Add Income',
              presentation: 'modal',
              headerTintColor: '#3B82F6',
              headerStyle: { backgroundColor: '#FFFFFF' },
              headerTitleStyle: { fontWeight: '700', color: '#0F172A' },
            }}
          />
          <Stack.Screen
            name="add-expense"
            options={{
              headerShown: true,
              title: 'Add Expense',
              presentation: 'modal',
              headerTintColor: '#3B82F6',
              headerStyle: { backgroundColor: '#FFFFFF' },
              headerTitleStyle: { fontWeight: '700', color: '#0F172A' },
            }}
          />
          <Stack.Screen
            name="budget"
            options={{
              headerShown: true,
              title: 'Set Budget',
              presentation: 'modal',
              headerTintColor: '#3B82F6',
              headerStyle: { backgroundColor: '#FFFFFF' },
              headerTitleStyle: { fontWeight: '700', color: '#0F172A' },
            }}
          />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
});
