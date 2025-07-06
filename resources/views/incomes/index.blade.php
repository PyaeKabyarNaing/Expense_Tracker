{{-- filepath: /Users/pyaekabyarnaing/Developments/Expense_Tracker/resources/views/transactions/index.blade.php --}}
@extends('layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="row">
        <div class="col-md-2">
            <nav class="nav flex-column bg-light rounded p-3 h-100">
                <a class="nav-link {{ request()->is('transactions') ? 'active fw-bold' : '' }}" href="{{ route('transactions.index') }}">
                    <i class="bi bi-list"></i> Transactions
                </a>
                <a class="nav-link {{ request()->is('transactions/create*') && request('type') === 'income' ? 'active fw-bold' : '' }}" href="{{ route('incomes.index') }}">
                    <i class="bi bi-plus-circle"></i>Income
                </a>
                <a class="nav-link {{ request()->is('transactions/create*') && request('type') === 'expense' ? 'active fw-bold' : '' }}" href="{{ route('transactions.create', ['type' => 'expense']) }}">
                    <i class="bi bi-dash-circle"></i>  Expense
                </a>
                {{-- Add more nav links for other tabs/pages as needed --}}
            </nav>
        </div>
        <div class="col-md-10">
                    <div class="card text-white bg-primary mb-2">
                        <div class="card-body">
                            <strong>Total Income:</strong>
                            <span class="float-end">${{ number_format($income, 2) }}</span>
                        </div>
                    </div>
                </div>
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
        </div>
    </div>
</div>
@endsection