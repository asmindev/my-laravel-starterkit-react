<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚨 Peringatan Keamanan Penting</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
        }
    </style>
</head>

<body class="bg-slate-900 min-h-screen flex items-center justify-center p-4 selection:bg-red-500 selection:text-white">
    <div class="max-w-4xl w-full bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
        <div class="grid grid-cols-1 lg:grid-cols-2">
            <!-- Left Side: Alert & Visuals -->
            <div class="bg-gradient-to-br from-red-600 to-rose-700 p-8 lg:p-12 text-white flex flex-col justify-center relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <div class="relative z-10">
                    <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 animate-pulse-slow">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h1 class="text-4xl lg:text-5xl font-bold mb-4 leading-tight">Ups! Anda Terkena Phishing.</h1>
                    <p class="text-red-100 text-lg leading-relaxed opacity-90">
                        Jangan panik. Ini hanya simulasi edukasi dari tim keamanan IT Anda. Namun jika ini nyata, data sensitif Anda sudah dicuri.
                    </p>

                    @if($submission)
                    <div class="mt-8 bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-2 h-2 rounded-full bg-red-400 animate-ping"></div>
                            <span class="text-sm font-medium text-red-200">Data yang Dimasukkan</span>
                        </div>
                        <div class="font-mono text-sm text-red-100 opacity-75">
                            {{ $submission->ip_address }} • {{ $submission->created_at->format('H:i:s') }}
                        </div>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Right Side: Education & Action -->
            <div class="p-8 lg:p-12 bg-slate-800">
                <div class="space-y-8">
                    <div>
                        <h2 class="text-2xl font-bold text-white mb-2">Apa yang baru saja terjadi?</h2>
                        <p class="text-slate-400">
                            Anda mengklik tautan simulasi phishing dan memasukkan data. Teknik ini sering digunakan peretas untuk mencuri password, data bank, dan informasi pribadi.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tanda Bahaya yang Terlewatkan</h3>

                        <div class="grid gap-3">
                            <div class="flex items-start gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-slate-700">
                                <span class="text-red-400 text-xl">🔍</span>
                                <div>
                                    <h4 class="font-medium text-slate-200">URL Palsu</h4>
                                    <p class="text-sm text-slate-400">Alamat web terlihat mirip tapi berbeda dari aslinya.</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-slate-700">
                                <span class="text-yellow-400 text-xl">⚠️</span>
                                <div>
                                    <h4 class="font-medium text-slate-200">Desakan Waktu</h4>
                                    <p class="text-sm text-slate-400">Email meminta tindakan segera ("Akun akan diblokir").</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    @if($submission)
                    <div class="pt-4">
                        <button onclick="acknowledgeAwareness({{ $submission->id }})"
                            class="w-full group relative flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-800 transition-all shadow-lg hover:shadow-blue-500/30">
                            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg class="h-5 w-5 text-blue-300 group-hover:text-blue-100 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            </span>
                            Saya Mengerti & Akan Lebih Waspada
                        </button>
                        <p id="ackMessage" class="text-center mt-3 text-sm h-5"></p>
                    </div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script>
        function acknowledgeAwareness(submissionId) {
            const btn = event.currentTarget;
            const originalContent = btn.innerHTML;

            // Loading state
            btn.disabled = true;
            btn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses...';

            fetch(`/account-security/safety-check/${submissionId}`, { // Updated route
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // No CSRF token needed as per exclusion, but harmless to include if present
                }
            })
            .then(response => response.json())
            .then(data => {
                btn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                btn.classList.add('bg-green-600', 'cursor-default');
                btn.innerHTML = '✓ Terima Kasih atas Partisipasi Anda';

                const msg = document.getElementById('ackMessage');
                msg.innerHTML = '<span class="text-green-400 font-medium tracking-wide">Edukasi Selesai. Anda aman.</span>';

                // Optional: confetti or visual celebration could go here

                setTimeout(() => {
                    // window.close(); // Often blocked by browsers
                    // Instead, redirect to a safe page or show generic success
                }, 2000);
            })
            .catch(error => {
                console.error('Error:', error);
                btn.disabled = false;
                btn.innerHTML = originalContent;
                document.getElementById('ackMessage').innerHTML =
                    '<span class="text-red-400">Gagal memproses. Silakan coba lagi.</span>';
            });
        }
    </script>
</body>
</html>
