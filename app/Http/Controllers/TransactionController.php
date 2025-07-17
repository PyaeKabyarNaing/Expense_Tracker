<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use App\Models\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index(Request $request)
{
    $transactions = Transaction::where('user_id', Auth::id())
        ->orderBy('date', 'desc')
        ->get();

    $income = $transactions->where('type', 'income')->sum('amount');
    $expense = $transactions->where('type', 'expense')->sum('amount');
    $balance = $income - $expense;

    // Fetch all categories
    $categories = Category::all();

    // Fetch budget for selected category (only one!)
    $selectedBudget = null;

    if ($request->filled('category_id')) {
        $selectedBudget = Budget::where('user_id', Auth::id())
            ->where('category_id', $request->category_id)
            ->first();
    }

    return view('transactions.index', compact(
        'transactions',
        'income',
        'expense',
        'balance',
        'categories',
        'selectedBudget'
    ));
}

    // public function add(Request $request)
    // {
    //     $type = $request->query('type', 'expense');
    //     if ($type == 'income') {
    //         return view('transactions.income', compact('type'));
    //     } else {
    //         return view('transactions.expense', compact('type'));
    //     }
    // }
    public function add(Request $request)
{
    $type = $request->query('type', 'expense'); // default to expense
    return view('transactions.create', compact('type'));
}

    public function create(Request $request)
    {
        $validator = validator(request()->all(), [
            "amount" => "required",
            "description" => "required",
            "date" => "required",
        ]);

        if($validator->fails()) {
            return back()->withErrors($validator);
        }

        $transaction = new Transaction;
        $transaction->amount = request()->amount;
        $transaction->description = request()->description;
        $transaction->date = request()->date;
        $transaction->user_id = Auth::id();
        $transaction->save();

        return redirect("/transactions")->with('success', 'Transaction added successfully!');
    }

    // public function income_create(Request $request)
    // {
    //     return view('transactions.income');
    // }

    // public function expense_create(Request $request)
    // {
    //     return view('transactions.expense');
    // }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]); // validating the request data

        Transaction::create([
            'user_id' => Auth::id(),
            'type' => $request->type,
            'amount' => $request->amount,
            'description' => $request->description,
            'date' => $request->date,
        ]);

        return redirect()->route('transactions.index')->with('success', 'Transaction added!');
    }

    // public function budget()
    // {
    //     $categories = Category::all();
    //     return view('transactions.index', compact('categories'));
    // }
}
