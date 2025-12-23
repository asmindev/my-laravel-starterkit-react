<?php

namespace App\Http\Controllers;

use App\Models\Recipient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RecipientImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        $header = fgetcsv($handle); // Skip header row

        $imported = 0;
        $skipped = 0;
        $errors = [];

        while (($row = fgetcsv($handle)) !== false) {
            // Assuming CSV format: email, name
            $email = $row[0] ?? null;
            $name = $row[1] ?? null;

            // Validate email
            $validator = Validator::make(
                ['email' => $email],
                ['email' => 'required|email']
            );

            if ($validator->fails()) {
                $errors[] = "Invalid email: {$email}";
                $skipped++;

                continue;
            }

            // Check if email already exists
            if (Recipient::where('email', $email)->exists()) {
                $skipped++;

                continue;
            }

            // Create recipient
            Recipient::create([
                'email' => $email,
                'name' => $name,
                'is_subscribed' => true,
            ]);

            $imported++;
        }

        fclose($handle);

        $message = "Import completed! {$imported} recipients imported, {$skipped} skipped.";

        if (! empty($errors)) {
            $message .= ' Some rows had errors.';
        }

        return redirect()->back()->with('success', $message);
    }
}
