<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use App\Models\Budget;
use App\Models\Category;

use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function categories()
    {
        $categories = Category::all();
        return view('budgets.index', compact('categories'));
    }

    public function store()
    {
        $budget = new Budget;
        $budget->user_id = Auth::id();
        $budget->category_id = request()->category_id;
        $budget->amount = request()->amount;
        $budget->start_date = request()->start_date;
        $budget->end_date = request()->end_date;
        $budget->save();

        return redirect('/transactions');
    }

    public function select()
    {
        $categories = Category::all();
        return view('transactions.index', compact('categories'));
    }
}
