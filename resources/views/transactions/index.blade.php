{{-- filepath: /Users/pyaekabyarnaing/Developments/Expense_Tracker/resources/views/transactions/index.blade.php --}}
@extends('layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="row">
        {{-- Sidebar for large screens --}}
        <div class="d-none d-lg-block col-lg-2">
            <nav class="nav flex-column bg-secondary rounded p-2 p-md-3 h-100">
                <a class="text-white nav-link {{ request()->is('transactions') ? 'active fw-bold' : '' }}" href="{{ route('transactions.index') }}">
                    <i class="bi bi-columns-gap"></i> Transactions
                </a>
                <a class="text-white nav-link" href="{{ route('incomes.index') }}">
                    <i class="bi bi-plus-circle"></i>Income
                </a>
                <a class="text-white nav-link {{ request()->is('transactions/create*') && request('type') === 'expense' ? 'active fw-bold' : '' }}" href="{{ route('transactions.create', ['type' => 'expense']) }}">
                    <i class="bi bi-dash-circle"></i> Add Expense
                </a>
                {{-- Add more nav links for other tabs/pages as needed --}}
            </nav>
        </div>
        {{-- Sidebar toggle for md and smaller screens --}}
        <div class="d-lg-none">
    <div class="row">
        <!-- Toggle button in col-2 -->
        <div class="col-1">
            <button class="btn btn-secondary w-100" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarCollapse" aria-expanded="false" aria-controls="sidebarCollapse">
                <i class="bi bi-list"></i>
            </button>
        </div>
        <!-- The collapsed menu auto-width -->
        <div class="col-auto">
            <div class="collapse mt-2" id="sidebarCollapse">
                <nav class="nav flex-column bg-secondary rounded p-2" style="width: max-content; min-width: 150px;">
                    <a class="text-white nav-link {{ request()->is('transactions') ? 'active fw-bold' : '' }}" href="{{ route('transactions.index') }}">
                        <i class="bi bi-columns-gap"></i>Transactions
                    </a>
                    <a class="text-white nav-link" href="{{ route('incomes.index') }}">
                        <i class="bi bi-plus-circle"></i> Income
                    </a>
                    <a class="text-white nav-link {{ request()->is('transactions/create*') && request('type') === 'expense' ? 'active fw-bold' : '' }}" href="{{ route('transactions.create', ['type' => 'expense']) }}">
                        <i class="bi bi-dash-circle"></i> Add Expense
                    </a>
                </nav>
            </div>
        </div>
    </div>
</div>

        <div class="col-12 col-lg-10">
            @if(session("success"))
            <div class="alert alert-success">
                {{ session("success") }}
            </div>
            @endif

            <h2 class="mb-4 text-center">Income & Expense Tracker</h2>
            <div class="row mb-4 justify-content-center g-3">
    <div class="col-md-6 col-lg-6">
        <div class="card text-white bg-dark">
            <div class="card-body">
                <strong class="h3">Balance:</strong>
                <span class="h3 float-end">${{ number_format($balance, 2) }}</span>
            </div>
        </div>
    </div>

    <div class="col-md-6 col-lg-6">
        <div class="card text-dark bg-white border-dark">
            <div class="card-body">
                <strong class="h3">Budget:</strong>
                <span class="h3 float-end">${{ number_format($balance, 2) }}</span><br><br>
                <button class="bg-dark text-white float-end rounded px-2 py-1">Set Budget</button>
            </div>
        </div>
    </div>

    <div class="col-md-6 col-lg-6">
        <div class="card text-white bg-primary">
            <div class="card-body">
                <strong class="h3">Total Income:</strong>
                <span class="h3 float-end">${{ number_format($income, 2) }}</span>
            </div>
        </div>
    </div>

    <div class="col-md-6 col-lg-6">
        <div class="card text-white bg-danger">
            <div class="card-body">
                <strong class="h3">Total Expense:</strong>
                <span class="h3 float-end">${{ number_format($expense, 2) }}</span>
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
                                <span class="badge {{ $t->type === 'income' ? 'bg-primary' : 'bg-danger' }}">
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