import { LoginForm } from '@/components/login-form';
import { Head } from '@inertiajs/react';

export default function LoginPage() {
    return (
        <>
            <Head title="Masuk" />
            <div className="flex min-h-svh flex-col items-center justify-center bg-black/50 bg-[url(https://kendariinfo.com/wp-content/uploads/2023/02/WhatsApp-Image-2023-02-09-at-18.12.36.jpeg)] bg-cover bg-center p-6 bg-blend-multiply md:p-10">
                <div className="w-full max-w-sm md:max-w-4xl">
                    <LoginForm />
                </div>
            </div>
        </>
    );
}
