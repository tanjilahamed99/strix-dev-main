import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Video } from "lucide-react";

export const metadata: Metadata = {
    title: "404 - Page Not Found | Strix Devs",
    description: "The page you are looking for does not exist or has been moved.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 text-center">
            <div className="max-w-md">
                <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold mb-4 inline-block">
                    Error 404
                </span>
                <h1 className="text-7xl sm:text-8xl font-bold tracking-tight mb-4 glow-text">
                    404
                </h1>
                <h2 className="text-2xl font-semibold mb-3">
                    Page Not Found
                </h2>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                    The link you followed may be broken, or the page may have been removed or moved to a new URL.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="btn-primary inline-flex items-center gap-2 py-3 px-6 w-full sm:w-auto text-xs"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Return Home</span>
                    </Link>
                    <Link
                        href="/contact"
                        className="btn-outline inline-flex items-center gap-2 py-3 px-6 w-full sm:w-auto text-xs"
                    >
                        <span>Contact Support</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
