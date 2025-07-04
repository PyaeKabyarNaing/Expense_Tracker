<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a demo user
        $user = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'password' => bcrypt('password'),
        ]);

        // Only seed transactions if the model exists
        if (class_exists(\App\Models\Transaction::class)) {
            \App\Models\Transaction::insert([
                [
                    'user_id' => $user->id,
                    'type' => 'income',
                    'amount' => 1500.00,
                    'description' => 'Salary',
                    'date' => now()->subDays(10)->toDateString(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => $user->id,
                    'type' => 'expense',
                    'amount' => 200.00,
                    'description' => 'Groceries',
                    'date' => now()->subDays(8)->toDateString(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => $user->id,
                    'type' => 'expense',
                    'amount' => 50.00,
                    'description' => 'Internet Bill',
                    'date' => now()->subDays(5)->toDateString(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => $user->id,
                    'type' => 'income',
                    'amount' => 200.00,
                    'description' => 'Freelance',
                    'date' => now()->subDays(3)->toDateString(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}
