"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, MapPin, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

const CATEGORIES = [
    { id: 'delivery', label: 'Delivery', icon: '📦' },
    { id: 'groceries', label: 'Groceries', icon: '🛒' },
    { id: 'errands', label: 'Errands', icon: '⏱️' },
    { id: 'repairs', label: 'Repairs', icon: '🔧' },
];

function RequestServiceContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type');

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        category: typeParam === 'repair' ? 'repairs' : typeParam === 'delivery' ? 'delivery' : 'delivery',
        title: '',
        description: '',
        price: '',
        priority: 'NORMAL',
        address: '',
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/auth');
            return;
        }
        setUser(JSON.parse(userData));

        // Update category if param changes
        if (typeParam) {
            setFormData(prev => ({
                ...prev,
                category: typeParam === 'repair' ? 'repairs' : typeParam === 'delivery' ? 'delivery' : prev.category
            }));
        }
    }, [router, typeParam]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError("");

        try {
            await api.post('/requests', {
                userId: user.id,
                price: parseFloat(formData.price),
                priority: formData.priority,
                location: {
                    lat: 0,
                    lng: 0,
                    address: formData.address,
                },
                // Mocking extra fields the backend might need or for display
                title: formData.title,
                category: formData.category,
                description: formData.description,
            });

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to create request");
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
                <h1 className="text-xl font-bold text-sahib-950">New Service Request</h1>
            </div>

            <main className="flex-1 p-6 space-y-8 overflow-y-auto">
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100 mb-6"
                        >
                            <AlertCircle size={20} />
                            <p className="text-sm font-semibold">{error}</p>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/80 backdrop-blur-sm"
                        >
                            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-sahib-100 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h2 className="text-2xl font-bold text-sahib-950 mb-2">Request Posted!</h2>
                                <p className="text-gray-500 font-medium">We're finding a provider for you...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-sahib-950 uppercase tracking-wider ml-1">Category</label>
                        <div className="grid grid-cols-2 gap-3">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.id })}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.category === cat.id
                                        ? 'border-sahib-600 bg-sahib-50 text-sahib-600'
                                        : 'border-sahib-50 bg-white text-gray-400 hover:border-sahib-200'
                                        }`}
                                >
                                    <span className="text-2xl">{cat.icon}</span>
                                    <span className="font-bold text-sm">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Request Details */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-sahib-950 uppercase tracking-wider ml-1">Service Title</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Bring food from Al-Baik"
                                className="w-full bg-sahib-50 border-none rounded-2xl p-4 text-sahib-950 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-sahib-600 transition-all"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-sahib-950 uppercase tracking-wider ml-1">Address / Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-sahib-400" size={20} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter service address"
                                    className="w-full bg-sahib-50 border-none rounded-2xl p-4 pl-12 text-sahib-950 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-sahib-600 transition-all"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-sahib-950 uppercase tracking-wider ml-1">Price (₦)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sahib-400 font-bold text-lg">₦</span>
                                    <input
                                        required
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full bg-sahib-50 border-none rounded-2xl p-4 pl-12 text-sahib-950 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-sahib-600 transition-all"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-sahib-950 uppercase tracking-wider ml-1">Priority</label>
                                <select
                                    className="w-full bg-sahib-50 border-none rounded-2xl p-4 text-sahib-950 font-medium focus:ring-2 focus:ring-sahib-600 transition-all appearance-none"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="NORMAL">Normal</option>
                                    <option value="URGENT">Urgent (+5 SR)</option>
                                    <option value="EXPRESS">Express (+10 SR)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-sahib-950 uppercase tracking-wider ml-1">Additional Notes</label>
                            <textarea
                                placeholder="Any special instructions?"
                                className="w-full bg-sahib-50 border-none rounded-2xl p-4 text-sahib-950 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-sahib-600 transition-all min-h-[100px] resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="btn-primary w-full py-4 mt-4 relative overflow-hidden group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                <span>Post Request</span>
                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}

export default function RequestServicePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-sahib-50">
                <Loader2 className="animate-spin text-sahib-600" size={48} />
            </div>
        }>
            <RequestServiceContent />
        </Suspense>
    );
}
