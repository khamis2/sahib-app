"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, ShieldCheck, Briefcase, Info, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const CATEGORIES = [
    { id: 'delivery', label: 'Delivery & Logistics', icon: '📦', description: 'Transport items safely and on time.' },
    { id: 'groceries', label: 'Personal Shopping', icon: '🛒', description: 'Shop for others and deliver their needs.' },
    { id: 'repairs', label: 'Technical Repairs', icon: '🔧', description: 'Fix appliances, electronics, or home items.' },
    { id: 'errands', label: 'General Errands', icon: '⏱️', description: 'Quick tasks and miscellaneous help.' },
];

export default function ProviderOnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        category: "",
        nin: "",
        experience: "BEGINNER",
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/auth');
            return;
        }
        setUser(JSON.parse(userData));
    }, [router]);

    const handleApply = async () => {
        if (!user) return;
        setLoading(true);
        setError("");

        try {
            // 1. Create provider application
            const result = await api.post('/providers/apply', {
                userId: user.id,
                category: formData.category,
            });

            if (result.error) throw new Error(result.error);

            // 2. Auto-verify for dev mode (Simulating admin approval)
            await api.patch(`/providers/${result.id}/verify`, {
                status: 'VERIFIED',
                ninBvnHash: formData.nin, // Mock hashing
            });

            // 3. Finalize
            setStep(4);
            // In a real app, we'd wait for admin approval
        } catch (err: any) {
            setError(err.message || "Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-sahib-50 min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl">
            {/* Header */}
            <div className="p-6 flex items-center gap-4 bg-white sticky top-0 z-10 border-b border-sahib-50">
                {step < 4 && (
                    <button onClick={() => step > 1 ? setStep(step - 1) : router.back()} className="p-2 hover:bg-sahib-50 rounded-full transition-colors text-sahib-950">
                        <ArrowLeft size={24} />
                    </button>
                )}
                <h1 className="text-xl font-bold text-sahib-950">Become a Provider</h1>
            </div>

            <main className="flex-1 p-6 space-y-8 overflow-y-auto">
                {/* Progress Bar */}
                {step < 4 && (
                    <div className="flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-sahib-600' : 'bg-sahib-100'}`} />
                        ))}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-black text-sahib-950">Pick your specialty</h2>
                                <p className="text-gray-500 mt-2 font-medium">Which service are you best at providing?</p>
                            </div>

                            <div className="grid gap-4">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setFormData({ ...formData, category: cat.id });
                                            setStep(2);
                                        }}
                                        className={`p-5 rounded-[2rem] border-2 text-left transition-all group ${formData.category === cat.id
                                            ? 'border-sahib-600 bg-sahib-50 shadow-lg shadow-sahib-500/10'
                                            : 'border-sahib-50 bg-white hover:border-sahib-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-sahib-50 group-hover:scale-110 transition-transform">
                                                {cat.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-sahib-950">{cat.label}</h3>
                                                <p className="text-xs text-gray-400 font-medium">{cat.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-black text-sahib-950 text-white bg-sahib-950 p-6 rounded-[2rem] shadow-xl">Identity Verification</h2>
                                <p className="text-gray-500 mt-6 font-medium px-2">To ensure safety, we need to verify your identity. Your data is encrypted.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                                    <ShieldCheck className="text-blue-600 mt-1" size={24} />
                                    <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Secure Verification</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-sahib-950 uppercase tracking-widest ml-1">NIN / BVN Number</label>
                                    <input
                                        type="password"
                                        placeholder="Enter your identification number"
                                        className="w-full p-4 bg-sahib-50 border-none rounded-2xl font-mono text-sahib-950 focus:ring-2 focus:ring-sahib-600 transition-all"
                                        value={formData.nin}
                                        onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                                    />
                                </div>

                                <button
                                    disabled={!formData.nin}
                                    onClick={() => setStep(3)}
                                    className="btn-primary w-full py-4 mt-6 disabled:opacity-50"
                                >
                                    Verify Identity
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-black text-sahib-950">Final Review</h2>
                                <p className="text-gray-500 mt-2 font-medium">Confirm your details before submitting.</p>
                            </div>

                            <div className="bg-sahib-50 rounded-3xl p-6 space-y-4">
                                <div className="flex justify-between items-center bg-white p-4 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <Briefcase size={20} className="text-sahib-600" />
                                        <span className="text-sm font-bold text-sahib-950">Category</span>
                                    </div>
                                    <span className="font-bold text-sahib-600 uppercase text-xs">{formData.category}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white p-4 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={20} className="text-green-600" />
                                        <span className="text-sm font-bold text-sahib-950">Status</span>
                                    </div>
                                    <span className="font-bold text-green-600 uppercase text-xs">Verified</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
                                    <AlertCircle size={20} />
                                    <p className="text-sm font-bold">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleApply}
                                disabled={loading}
                                className="btn-primary w-full py-4 mt-6"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Complete Application"}
                            </button>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center space-y-8 py-10"
                        >
                            <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
                                <CheckCircle2 size={48} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-sahib-950">Welcome, Partner!</h2>
                                <p className="text-gray-500 mt-3 font-medium px-4">Your provider account is active. You can now start accepting jobs and earning money.</p>
                            </div>

                            <button
                                onClick={() => router.push('/provider/dashboard')}
                                className="btn-primary w-full py-4"
                            >
                                Enter Provider Dashboard
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
