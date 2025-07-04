{{-- filepath: /Users/pyaekabyarnaing/Developments/Expense_Tracker/resources/views/transactions/index.blade.php --}}
@extends('layouts.app')

@section('content')
<div class="container py-4">
    <h2 class="mb-4 text-center">Income & Expense Tracker</h2>
    <div class="row mb-4 justify-content-center">
        <div class="col-md-4">
            <div class="card text-white bg-success mb-2">
                <div class="card-body">
                    <strong>Balance:</strong>
                    <span class="float-end">${{ number_format($balance, 2) }}</span>
                </div>
            </div>
            <div class="card text-white bg-primary mb-2">
                <div class="card-body">
                    <strong>Total Income:</strong>
                    <span class="float-end">${{ number_format($income, 2) }}</span>
                </div>
            </div>
            <div class="card text-white bg-danger">
                <div class="card-body">
                    <strong>Total Expense:</strong>
                    <span class="float-end">${{ number_format($expense, 2) }}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="mb-3 text-end">
        <a href="{{ route('transactions.create', ['type' => 'income']) }}" class="btn btn-dark">Add Income</a>
        <a href="{{ route('transactions.create', ['type' => 'expense']) }}" class="btn btn-dark">Add Expense</a>

    </div>
    <div class="table-responsive">
        <table class="table table-bordered table-striped align-middle">
            <thead class="table-dark">
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                @forelse($transactions as $t)
                <tr>
                    <td>{{ $t->date }}</td>
                    <td>
                        <span class="badge {{ $t->type === 'income' ? 'bg-success' : 'bg-danger' }}">
                            {{ ucfirst($t->type) }}
                        </span>
                    </td>
                    <td>
                        ${{ number_format($t->amount, 2) }}
                    </td>
                    <td>{{ $t->description }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="text-center">No transactions found.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    @endsection