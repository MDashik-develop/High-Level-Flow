<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebsiteAudit extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'services' => 'array',
        'contact_info' => 'array',
        'tech_stack' => 'array',
        'missing_tools' => 'array',
        'audit_score' => 'integer',
    ];

    public function convertedContact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'converted_contact_id');
    }
}
