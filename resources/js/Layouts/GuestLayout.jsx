import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div
            className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(0, 120, 212, 0.8), rgba(0, 120, 212, 0.8)), url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white shadow-2xl overflow-hidden sm:rounded-xl">
                <div className="flex justify-center mb-6">
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-blue-600" />
                    </Link>
                </div>

                <h2 className="text-center text-2xl font-bold text-gray-700 mb-4">
                    Génesis Hospital
                </h2>

                {children}
            </div>
        </div>
    );
}
