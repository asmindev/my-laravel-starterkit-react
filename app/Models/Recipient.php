<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipient extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'name',
        'is_subscribed',
    ];

    protected function casts(): array
    {
        return [
            'is_subscribed' => 'boolean',
        ];
    }
}
