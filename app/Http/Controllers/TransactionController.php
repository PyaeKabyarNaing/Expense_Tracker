<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::where('user_id', Auth::id())->orderBy('date', 'desc')->get();
        $income = $transactions->where('type', 'income')->sum('amount');
        $expense = $transactions->where('type', 'expense')->sum('amount');
        $balance = $income - $expense; // calculating balance

        return view('transactions.index', compact('transactions', 'income', 'expense', 'balance')); // passing balance to the view
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

        return redirect("/transactions");
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
}
