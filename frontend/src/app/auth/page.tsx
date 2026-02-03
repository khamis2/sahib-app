"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowLeft, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRequestOtp = async () => {
        if (!phone) return;
        setLoading(true);
        setError(null);
        try {
            await api.post('/auth/request-otp', { phoneNumber: phone });
            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpValue = otp.join("");
        if (otpValue.length < 6) return;
        setLoading(true);
        setError(null);
        try {
            const data = await api.post('/auth/verify-otp', { phoneNumber: phone, otp: otpValue });
            // Store user data/token in localStorage for now
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.accessToken);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    return (
        <div className="bg-sahib-50 min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl">
            {/* Header */}
            <div className="p-6 flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-sahib-50 rounded-full transition-colors text-sahib-950">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold text-sahib-950">Authentication</h1>
            </div>

            <div className="flex-1 p-8 flex flex-col justify-center">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-12 text-center"
                >
                    <div className="w-16 h-16 bg-sahib-100 text-sahib-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-sahib-950 mb-3">
                        {step === 1 ? "Welcome Back" : "Verify Phone"}
                    </h2>
                    <p className="text-gray-500 font-medium">
                        {step === 1
                            ? "Enter your phone number to continue with Sahib Services."
                            : `We've sent a 6-digit code to ${phone}`}
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 mb-6 font-bold text-sm"
                        >
                            <AlertCircle size={20} />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {step === 1 ? (
                    <motion.div
                        key="phone-step"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-sahib-900 ml-1">Phone Number</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sahib-600 transition-colors">
                                    <Phone size={20} />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="080 0000 0000"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-sahib-50 border-2 border-transparent focus:border-sahib-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleRequestOtp}
                            disabled={loading}
                            className="btn-primary w-full py-4 text-lg shadow-xl disabled:opacity-70 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    <span>Connecting...</span>
                                </>
                            ) : "Get OTP"}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="otp-step"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex justify-between gap-3">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    className="w-full aspect-square text-center font-extrabold text-2xl bg-sahib-50 border-2 border-transparent focus:border-sahib-500 focus:bg-white rounded-xl outline-none transition-all shadow-sm"
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="btn-primary w-full py-4 text-lg shadow-xl disabled:opacity-70 flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="animate-spin" size={24} /> : "Verify & Continue"}
                            </button>
                            <button
                                onClick={handleRequestOtp}
                                disabled={loading}
                                className="w-full text-center text-sahib-600 font-bold text-sm hover:underline disabled:opacity-50"
                            >
                                Resend Code
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Footer */}
            <div className="p-8 text-center">
                <p className="text-gray-400 text-sm font-medium">
                    Secure and Halal Service Marketplace
                </p>
            </div>
        </div>
    );
}
