<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Funnel extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'total_revenue' => 'float',
    ];

    public function steps(): HasMany
    {
        return $this->hasMany(FunnelStep::class)->orderBy('step_number');
    }

    public function getConversionRateAttribute(): float
    {
        if ($this->total_visitors === 0) {
            return 0.0;
        }
        return round(($this->total_optins / $this->total_visitors) * 100, 1);
    }
}
