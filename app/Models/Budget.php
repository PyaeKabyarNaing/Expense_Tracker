<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    /** @use HasFactory<\Database\Factories\BudgetFactory> */
    use HasFactory;

    public function category()
        {
        return $this->belongsTo('App\Models\Category');
        }

    public function user()
        {
        return $this->belongsTo('App\Models\User');
        }
}
