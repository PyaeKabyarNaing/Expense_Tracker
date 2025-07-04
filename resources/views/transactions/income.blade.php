{{-- filepath: /Users/pyaekabyarnaing/Developments/Expense_Tracker/resources/views/transactions/create.blade.php --}}
@extends('layouts.app')

@section('content')
<div class="container py-4">
    <h2 class="mb-4 text-center">Add Income</h2>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <form method="POST" action="{{ route('transactions.store') }}">
                @csrf
                <div class="mb-3">
                    <label for="type" class="form-label">Type</label>
                    <input type="text" name="type" id="type" class="form-control" value="Income" readonly>
                </div>
                <div class="mb-3">
                    <label for="amount" class="form-label">Amount</label>
                    <input type="number" step="0.01" name="amount" id="amount" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <input type="text" name="description" id="description" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="date" class="form-label">Date</label>
                    <input type="date" name="date" id="date" class="form-control" required>
                </div>
                <div class="d-flex justify-content-between">
                    <a href="{{ route('transactions.index') }}" class="btn btn-outline-secondary">Back</a>
                    <button type="submit" class="btn btn-success">Add</button>
                </div>
            </form>
        </div>
    </div>
    @endsection