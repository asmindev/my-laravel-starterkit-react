<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>⚠️ Simulasi Phishing - Edukasi Keamanan</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gradient-to-br from-orange-50 to-red-50 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <!-- Header Alert -->
        <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 text-center">
            <div class="text-6xl mb-4">⚠️</div>
            <h1 class="text-3xl font-bold mb-2">PERINGATAN KEAMANAN!</h1>
            <p class="text-lg">Anda Baru Saja Menjadi Korban Simulasi Phishing</p>
        </div>

        <!-- Content -->
        <div class="p-8 space-y-6">
            @if($submission)
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-lg font-semibold text-yellow-800">Data Anda Telah Terekam</h3>
                        <p class="text-yellow-700 mt-1">
                            Ini adalah simulasi edukasi. Dalam skenario nyata, informasi login Anda akan dicuri oleh
                            penyerang.
                        </p>
                    </div>
                </div>
            </div>
            @endif

            <!-- Educational Content -->
            <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-4">🎓 Apa itu Phishing?</h2>
                <p class="text-gray-600 mb-4">
                    Phishing adalah teknik penipuan online di mana penyerang menyamar sebagai entitas tepercaya
                    untuk mencuri informasi sensitif seperti username, password, dan data kartu kredit.
                </p>
            </div>

            <!-- Warning Signs -->
            <div class="bg-blue-50 rounded-lg p-6">
                <h3 class="text-xl font-bold text-blue-900 mb-3">🔍 Tanda-tanda Phishing:</h3>
                <ul class="space-y-2 text-blue-800">
                    <li class="flex items-start">
                        <span class="mr-2">✓</span>
                        <span>URL yang mencurigakan atau tidak sesuai dengan website resmi</span>
                    </li>
                    <li class="flex items-start">
                        <span class="mr-2">✓</span>
                        <span>Email dari pengirim yang tidak dikenal atau alamat email aneh</span>
                    </li>
                    <li class="flex items-start">
                        <span class="mr-2">✓</span>
                        <span>Permintaan mendesak untuk memberikan informasi pribadi</span>
                    </li>
                    <li class="flex items-start">
                        <span class="mr-2">✓</span>
                        <span>Kesalahan tata bahasa atau ejaan yang buruk</span>
                    </li>
                    <li class="flex items-start">
                        <span class="mr-2">✓</span>
                        <span>Link yang mengarah ke website berbeda saat di-hover</span>
                    </li>
                </ul>
            </div>

            <!-- Protection Tips -->
            <div class="bg-green-50 rounded-lg p-6">
                <h3 class="text-xl font-bold text-green-900 mb-3">🛡️ Cara Melindungi Diri:</h3>
                <ol class="space-y-2 text-green-800 list-decimal list-inside">
                    <li>Selalu periksa URL website sebelum login</li>
                    <li>Jangan klik link mencurigakan dari email/SMS</li>
                    <li>Aktifkan Two-Factor Authentication (2FA)</li>
                    <li>Gunakan password manager untuk password yang unik</li>
                    <li>Update software dan browser secara berkala</li>
                    <li>Hubungi perusahaan langsung jika ragu dengan email mereka</li>
                </ol>
            </div>

            <!-- Statistics (if available) -->
            @if($submission)
            <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-3">📊 Informasi Simulasi:</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-gray-600">Email Target:</span>
                        <p class="font-semibold text-gray-900">{{ $identifier }}</p>
                    </div>
                    <div>
                        <span class="text-gray-600">Waktu Submit:</span>
                        <p class="font-semibold text-gray-900">{{ $submission->created_at->format('d/m/Y H:i') }}</p>
                    </div>
                    <div>
                        <span class="text-gray-600">Template:</span>
                        <p class="font-semibold text-gray-900">{{ $submission->formTemplate->name }}</p>
                    </div>
                    <div>
                        <span class="text-gray-600">IP Address:</span>
                        <p class="font-semibold text-gray-900">{{ $submission->ip_address }}</p>
                    </div>
                </div>
            </div>
            @endif

            <!-- Acknowledgment Button -->
            @if($submission)
            <div class="text-center pt-4">
                <button onclick="acknowledgeAwareness({{ $submission->id }})"
                    class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg">
                    ✓ Saya Mengerti dan Akan Lebih Waspada
                </button>
                <p class="text-sm text-gray-500 mt-3" id="ackMessage"></p>
            </div>
            @endif

            <!-- Footer -->
            <div class="text-center text-sm text-gray-500 pt-6 border-t">
                <p>Simulasi ini dibuat untuk tujuan edukasi keamanan siber.</p>
                <p class="mt-1">Data Anda telah dienkripsi dan hanya digunakan untuk analisis internal.</p>
            </div>
        </div>
    </div>

    <script>
        function acknowledgeAwareness(submissionId) {
            fetch(`/phishing/acknowledge/${submissionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                }
            })
            .then(response => response.json())
            .then(data => {
                const btn = event.target;
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
                btn.innerHTML = '✓ Terima Kasih!';

                document.getElementById('ackMessage').innerHTML =
                    '<span class="text-green-600 font-semibold">' + data.message + '</span>';

                setTimeout(() => {
                    window.close();
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('ackMessage').innerHTML =
                    '<span class="text-red-600">Terjadi kesalahan. Silakan coba lagi.</span>';
            });
        }
    </script>
</body>

</html>
