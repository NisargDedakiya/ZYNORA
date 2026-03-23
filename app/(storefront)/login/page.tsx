"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check if middleware bounced them here
    const urlError = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(urlError === "unauthorized" ? "Access Denied. Admins Only." : "");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError("Invalid email or password.");
                setIsLoading(false);
                return;
            }

            // Immediately check the new session state to redirect correctly
            const sessionRes = await fetch("/api/auth/session");
            const sessionData = await sessionRes.json();

            if (sessionData?.user?.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/");
            }
            router.refresh();

        } catch {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="sm:mx-auto sm:w-full sm:max-w-md px-4"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block flex flex-col items-center">
                        <Image src="/assets/logo.png" alt="ZYNORA LUXE" width={160} height={50} className="object-contain" />
                    </Link>
                </div>

                <div className="bg-white py-8 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-gray-100/50 sm:px-10">
                    <h1 className="text-2xl font-heading text-gray-900 text-center mb-8">
                        Welcome Back
                    </h1>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-[#111111] sm:text-sm transition-colors"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-[#111111] sm:text-sm transition-colors"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-semibold text-white bg-[#111111] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-semibold text-[#111111] hover:underline transition-colors">
                            Create one
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#111111]" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
