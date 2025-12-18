import { Head } from '@inertiajs/react';
import { ArrowRight, CalendarRange, CheckCircle2, Compass, Mail, MapPin, ShieldCheck, Ship, Sparkles, Waves } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

const highlights = [
    {
        title: 'Armada aman & nyaman',
        description: 'Kapal ber-crew lokal berpengalaman dengan prosedur keselamatan yang diperiksa setiap jadwal berangkat.',
        icon: ShieldCheck,
    },
    {
        title: 'Destinasi unggulan',
        description: 'Labengki, Saponda, Bokori, Wakatobi, dan pulau kecil tersembunyi di Sulawesi Tenggara.',
        icon: MapPin,
    },
    {
        title: 'Jadwal pasti & realtime',
        description: 'Lihat ketersediaan kursi, jadwal berangkat, dan status cuaca sebelum reservasi.',
        icon: CalendarRange,
    },
];

const steps = [
    'Pilih rute dan tanggal berangkat dari Kendari atau dermaga terdekat.',
    'Konfirmasi jumlah tamu, opsi kabin/seat, dan tambah layanan snorkeling atau makan siang.',
    'Terima e-ticket dan boarding pass digital; tunjukkan QR saat check-in di dermaga.',
];

const featuredRoutes = [
    {
        name: 'Kendari → Labengki',
        duration: '1 hari',
        price: 'Mulai 850k/orang',
        slots: 'Sisa 24 kursi',
    },
    {
        name: 'Kendari → Saponda',
        duration: 'Half day',
        price: 'Mulai 520k/orang',
        slots: 'Sisa 8 kursi',
    },
    {
        name: 'Kendari → Wakatobi',
        duration: '3 hari 2 malam',
        price: 'Mulai 3.2jt/pax',
        slots: 'Jadwal minggu depan',
    },
];

export default function Welcome() {
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-50">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(16,185,129,0.18),transparent_26%),radial-gradient(circle_at_55%_70%,rgba(244,63,94,0.15),transparent_28%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(16,185,129,0.24),transparent_26%),radial-gradient(circle_at_55%_70%,rgba(244,63,94,0.2),transparent_28%)]" />
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-14 lg:gap-20 lg:px-10 lg:py-20">
                    <section className="relative z-10 grid items-center gap-10 rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.14)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr] lg:p-14 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_120px_rgba(0,0,0,0.32)]">
                        <div className="space-y-6">
                            <Badge className="bg-emerald-500/10 text-emerald-800 ring-1 ring-emerald-400/40 dark:text-emerald-200">
                                Trip Kapal Kendari · Sulawesi Tenggara
                            </Badge>
                            <div className="space-y-4">
                                <h1 className="text-4xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                                    Jelajah pulau tenang dengan kapal aman & tepat waktu
                                </h1>
                                <p className="max-w-2xl text-base text-slate-600 dark:text-slate-200">
                                    Kami mengoperasikan trip reguler dan privat dari Kendari menuju pulau-pulau cantik di Sulawesi Tenggara. Pesan
                                    tiket kapal, cek ketersediaan seat, dan nikmati boarding tanpa antre.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button size="lg" className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400 dark:text-emerald-950">
                                    Lihat jadwal trip <ArrowRight className="size-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                                >
                                    Hubungi kru dermaga
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-3 dark:text-slate-200">
                                {highlights.map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
                                    >
                                        <item.icon className="mt-0.5 size-5 text-emerald-500 dark:text-emerald-300" />
                                        <div className="space-y-1">
                                            <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                                            <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Card className="border-slate-200/70 bg-gradient-to-b from-white/90 to-white/70 text-slate-900 shadow-xl dark:border-white/15 dark:from-slate-900/70 dark:to-slate-900/40 dark:text-slate-50">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-lg">
                                    Rangkuman armada & kursi
                                    <Badge className="bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-400/40 dark:text-emerald-100">
                                        Real-time
                                    </Badge>
                                </CardTitle>
                                <CardDescription className="text-slate-600 dark:text-slate-200">
                                    Pantau ketersediaan kapal, jadwal berangkat, dan kapasitas sebelum memesan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                                        <p className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-300">Seat tersedia hari ini</p>
                                        <p className="text-2xl font-semibold text-slate-900 dark:text-white">184 kursi</p>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-200">3 kapal beroperasi</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                                        <p className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-300">Keberangkatan terdekat</p>
                                        <p className="text-2xl font-semibold text-slate-900 dark:text-white">08:30 WITA</p>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-200">Dermaga Kendari → Labengki</p>
                                    </div>
                                </div>
                                <Separator className="bg-slate-200/80 dark:bg-white/10" />
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between rounded-lg border border-slate-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                                        <div className="space-y-1">
                                            <p className="text-slate-900 dark:text-white">Kendari → Labengki</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-300">Seat tersisa: 24 / 60</p>
                                        </div>
                                        <Badge className="bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-400/40 dark:text-emerald-100">
                                            On time
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border border-slate-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                                        <div className="space-y-1">
                                            <p className="text-slate-900 dark:text-white">Kendari → Saponda</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-300">Seat tersisa: 8 / 40</p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="border-amber-400/70 text-amber-800 dark:border-amber-300/50 dark:text-amber-100"
                                        >
                                            Hampir penuh
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="relative z-10 grid gap-6 rounded-3xl border border-slate-200/70 bg-white/85 p-8 shadow-[0_20px_90px_rgba(0,0,0,0.12)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr] lg:p-14 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_90px_rgba(0,0,0,0.28)]">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Company profile & layanan</h2>
                                <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-200">
                                    Operator kapal lokal berbasis di Kendari yang fokus pada trip pulau: wisata harian, charter privat, hingga
                                    ekspedisi menyelam. Kami menyediakan perizinan, guide, dan logistik agar perjalanan tetap aman.
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Card className="border-slate-200/70 bg-white/80 text-slate-900 shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-50">
                                    <CardHeader>
                                        <CardTitle className="text-base">Alur pemesanan</CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-200">
                                            Pesan tiket kapal dalam tiga langkah sederhana.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        {steps.map((item) => (
                                            <div
                                                key={item}
                                                className="flex gap-3 rounded-lg border border-slate-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                                            >
                                                <CheckCircle2 className="mt-0.5 size-4 text-emerald-500 dark:text-emerald-300" />
                                                <p className="text-slate-800 dark:text-slate-100">{item}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                                <Card className="border-slate-200/70 bg-white/80 text-slate-900 shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-50">
                                    <CardHeader className="flex-row items-center gap-3">
                                        <Avatar className="size-12 border border-slate-200/70 dark:border-white/20">
                                            <AvatarImage
                                                src="https://images.unsplash.com/photo-1499336315816-097655dcfbda?auto=format&fit=crop&w=120&q=80"
                                                alt="Kapten"
                                            />
                                            <AvatarFallback className="bg-emerald-600 text-white">KT</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base">Kapten Tomi</CardTitle>
                                            <CardDescription className="text-slate-600 dark:text-slate-200">
                                                Lead Skipper · 12 tahun pengalaman
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                                        <p>
                                            “Kami rutin membawa tamu ke Labengki dan Saponda. Setiap perjalanan diawali dengan safety briefing,
                                            pengecekan cuaca, dan rute cadangan agar tamu tetap nyaman.”
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-200">
                                            <Sparkles className="size-3.5" />
                                            500+ trip sukses tanpa insiden
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                {featuredRoutes.map((route) => (
                                    <Card
                                        key={route.name}
                                        className="border-slate-200/70 bg-white/80 text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-50"
                                    >
                                        <CardHeader className="space-y-2">
                                            <Badge className="w-fit bg-emerald-500/10 text-emerald-800 ring-1 ring-emerald-400/30 dark:text-emerald-100">
                                                {route.duration}
                                            </Badge>
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                <MapPin className="size-4 text-emerald-500" />
                                                {route.name}
                                            </CardTitle>
                                            <CardDescription className="text-slate-600 dark:text-slate-200">{route.price}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-300">{route.slots}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-slate-200 text-slate-900 hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                            >
                                                Pesan
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        <Card className="border-slate-200/70 bg-white/80 text-slate-900 shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-50">
                            <CardHeader>
                                <CardTitle className="text-lg">Buat permintaan jadwal</CardTitle>
                                <CardDescription className="text-slate-600 dark:text-slate-200">
                                    Kirim detail rencana perjalanan Anda. Kami akan balas kurang dari 1 jam di hari kerja.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama lengkap</Label>
                                        <Input
                                            id="name"
                                            placeholder="Nama Anda"
                                            className="border-slate-200/70 bg-white text-slate-900 placeholder:text-slate-500 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email kerja</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@perusahaan.com"
                                            className="border-slate-200/70 bg-white text-slate-900 placeholder:text-slate-500 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Kebutuhan acara</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Ceritakan tentang acara atau integrasi yang Anda butuhkan."
                                            className="min-h-[120px] border-slate-200/70 bg-white text-slate-900 placeholder:text-slate-500 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400 dark:text-emerald-950">
                                        Kirim permintaan <Mail className="size-4" />
                                    </Button>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">Respon rata-rata kurang dari 1 jam di hari kerja.</p>
                                </div>
                                <Separator className="bg-slate-200/80 dark:bg-white/10" />
                                <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-200">
                                    <Badge variant="outline" className="border-slate-300 text-slate-800 dark:border-white/30 dark:text-white">
                                        <Ship className="mr-1.5 size-3.5" />
                                        Charter privat tersedia
                                    </Badge>
                                    <Badge variant="outline" className="border-slate-300 text-slate-800 dark:border-white/30 dark:text-white">
                                        <Waves className="mr-1.5 size-3.5" />
                                        Pantau cuaca harian
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="relative z-10 overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-r from-emerald-500/15 via-emerald-400/15 to-sky-400/15 px-8 py-10 shadow-[0_15px_70px_rgba(16,185,129,0.25)] lg:px-14 lg:py-12 dark:border-emerald-300/20 dark:from-emerald-500/10 dark:via-emerald-400/10 dark:to-sky-400/10 dark:shadow-[0_15px_70px_rgba(16,185,129,0.3)]">
                        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-3">
                                <Badge className="bg-white/80 text-emerald-800 ring-1 ring-emerald-400/40 dark:bg-white/10 dark:text-emerald-100">
                                    Siap berangkat
                                </Badge>
                                <h3 className="text-3xl font-semibold text-slate-900 dark:text-white">Jadwalkan trip berikutnya dengan kru kami</h3>
                                <p className="max-w-2xl text-sm text-slate-700 dark:text-slate-200">
                                    Kirim detail rombongan, pilih rute, dan kami siapkan manifest, logistik, serta update cuaca harian.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Button className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400 dark:text-emerald-950">
                                        Lihat jadwal terbaru
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-slate-200 bg-white/80 text-slate-900 hover:bg-slate-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                    >
                                        Konsultasi rute
                                    </Button>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/40 bg-white/70 p-6 text-slate-900 shadow-lg dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-50">
                                <div className="flex items-center gap-3 pb-4">
                                    <div className="rounded-full bg-emerald-500/15 p-3 text-emerald-600 dark:text-emerald-200">
                                        <Compass className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Rute populer pekan ini</p>
                                        <p className="text-lg font-semibold">Kendari → Labengki</p>
                                    </div>
                                </div>
                                <Separator className="mb-4 bg-slate-200/70 dark:bg-white/10" />
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-300">Waktu tempuh</span>
                                        <span className="font-semibold">2 jam</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-300">Kapasitas</span>
                                        <span className="font-semibold">60 kursi</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-300">Cuaca</span>
                                        <span className="font-semibold">Aman berlayar</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
