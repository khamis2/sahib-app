"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Wallet, Plus, CreditCard, Smartphone, Building2, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Confetti } from "@/components/ui/Confetti";

const AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

export default function FundWalletPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState("");

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/auth');
            return;
        }
        setUser(JSON.parse(userData));
    }, [router]);

    const handleFund = async () => {
        const amount = selectedAmount || parseInt(customAmount);
        if (!amount || amount < 100) {
            setError("Minimum amount is ₦100");
            return;
        }
        if (!user) return;

        setLoading(true);
        setError("");

        try {
            const result = await api.post('/users/fund', {
                userId: user.id,
                amount: amount,
            });

            if (result.error) {
                throw new Error(result.error);
            }

            // Update local user data
            const updatedUser = { ...user, balance: result.balance };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to fund wallet");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-sahib-50 min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl">
            {/* Header */}
            <div className="p-6 flex items-center gap-4 bg-white sticky top-0 z-10 border-b border-sahib-50">
                <Link href="/dashboard" className="p-2 hover:bg-sahib-50 rounded-full transition-colors text-sahib-950">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold text-sahib-950">Fund Wallet</h1>
            </div>

            <main className="flex-1 p-6 space-y-8 overflow-y-auto">
                {/* Current Balance Card */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-sahib-950 rounded-3xl p-6 text-white relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <span className="text-sahib-400 font-bold text-xs uppercase tracking-[0.2em]">Current Balance</span>
                        <h3 className="text-3xl font-extrabold mt-1">
                            <span className="text-sahib-500">₦</span>
                            {(user?.balance || 0).toLocaleString()}
                        </h3>
                    </div>
                    <Wallet className="absolute right-4 top-4 text-sahib-800" size={48} />
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-sahib-600/20 rounded-full blur-3xl"></div>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-semibold">
                        {error}
                    </div>
                )}

                {/* Success Modal */}
                {success && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/80 backdrop-blur-sm"
                    >
                        <Confetti />
                        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-sahib-100 flex flex-col items-center text-center relative z-10">
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-sahib-950 mb-2">Wallet Funded!</h2>
                            <p className="text-gray-500 font-medium">₦{(selectedAmount || parseInt(customAmount)).toLocaleString()} added to your wallet</p>
                        </div>
                    </motion.div>
                )}

                {/* Quick Amounts */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-sahib-950 uppercase tracking-wider">Quick Amount</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {AMOUNTS.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => {
                                    setSelectedAmount(amount);
                                    setCustomAmount("");
                                }}
                                className={`p-4 rounded-2xl border-2 font-bold transition-all ${selectedAmount === amount
                                    ? 'border-sahib-600 bg-sahib-50 text-sahib-600'
                                    : 'border-sahib-100 bg-white text-sahib-950 hover:border-sahib-200'
                                    }`}
                            >
                                ₦{amount.toLocaleString()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-sahib-950 uppercase tracking-wider">Or Enter Custom Amount</h3>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sahib-400 font-bold text-lg">₦</span>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            className="w-full bg-sahib-50 border-none rounded-2xl p-4 pl-10 text-sahib-950 font-bold text-lg placeholder:text-gray-400 focus:ring-2 focus:ring-sahib-600 transition-all"
                            value={customAmount}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setSelectedAmount(null);
                            }}
                        />
                    </div>
                </div>

                {/* Payment Methods (Visual only for now) */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-sahib-950 uppercase tracking-wider">Payment Method</h3>
                    <div className="space-y-3">
                        <div className="p-4 rounded-2xl border-2 border-sahib-600 bg-sahib-50 flex items-center gap-4">
                            <div className="w-12 h-12 bg-sahib-600 text-white rounded-xl flex items-center justify-center">
                                <CreditCard size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sahib-950">Test Mode</p>
                                <p className="text-xs text-gray-500">Instant funding for development</p>
                            </div>
                            <div className="w-5 h-5 bg-sahib-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={14} className="text-white" />
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl border-2 border-sahib-100 bg-white flex items-center gap-4 opacity-50">
                            <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center">
                                <Building2 size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-400">Bank Transfer</p>
                                <p className="text-xs text-gray-400">Coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fund Button */}
                <button
                    disabled={loading || (!selectedAmount && !customAmount)}
                    onClick={handleFund}
                    className="btn-primary w-full py-4 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={24} />
                    ) : (
                        <>
                            <Plus size={20} />
                            <span>Fund ₦{(selectedAmount || parseInt(customAmount) || 0).toLocaleString()}</span>
                        </>
                    )}
                </button>
            </main>
        </div>
    );
}
