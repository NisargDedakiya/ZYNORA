"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Admin Dashboard Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-red-100 rounded-none p-8 text-center shadow-sm">
            <h2 className="text-2xl font-heading text-gray-900 mb-4">Something went wrong!</h2>
            <p className="text-gray-500 mb-8 max-w-md">
                The administrative dashboard encountered an unexpected error while trying to process your request.
                This may be due to a temporary database connection issue or a missing configuration.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-2 bg-gold text-white font-semibold rounded hover:bg-gold/90 transition-colors"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-gray-200 transition-colors"
                >
                    Return Home
                </Link>
            </div>

            <p className="mt-8 text-xs font-mono text-gray-400 max-w-lg overflow-hidden text-ellipsis whitespace-nowrap">
                {error.message || "Unknown Server Error"}
            </p>
        </div>
    );
}
