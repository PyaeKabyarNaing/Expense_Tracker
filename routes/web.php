<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\IncomeController;

// Route::get('/', function () {
//     return view('welcome');
// });

    Route::get('/', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');

Route::middleware(['auth'])->group(function () {
    Route::get('/transactions/income', [TransactionController::class, 'add'])->name('transactions.add');

    Route::post('/transactions/income', [TransactionController::class, 'create'])->name('transactions.create');

    // Route::get('/transactions/income_create', [TransactionController::class, 'income_create'])->name('transactions.income'); 

    // Route::get('/transactions/expense_create', [TransactionController::class, 'expense_create'])->name('transactions.expense'); 

    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');

    // income
    Route::get('/incomes', [IncomeController::class, 'index'])->name('incomes.index');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
