"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Wallet, Calendar, CheckCircle2, XCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const TYPE_CONFIG: Record<string, any> = {
    CREDIT: { icon: ArrowDownLeft, color: 'text-green-600 bg-green-50', sign: '+' },
    DEBIT: { icon: ArrowUpRight, color: 'text-red-600 bg-red-50', sign: '-' },
};

const STATUS_COLORS: Record<string, string> = {
    COMPLETED: 'text-green-600',
    PENDING: 'text-yellow-600',
    FAILED: 'text-red-600',
};

export default function TransactionHistoryPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            const userData = localStorage.getItem('user');
            if (!userData) {
                router.push('/auth');
                return;
            }
            const user = JSON.parse(userData);

            try {
                // Fetch transactions from backend
                const data = await api.get(`/users/${user.id}/transactions`);
                if (data.error) {
                    setError(data.error);
                } else {
                    setTransactions(data);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load transactions");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [router]);

    return (
        <div className="bg-sahib-50 min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl">
            {/* Header */}
            <div className="p-6 flex items-center gap-4 bg-white sticky top-0 z-10 border-b border-sahib-50">
                <Link href="/dashboard" className="p-2 hover:bg-sahib-50 rounded-full transition-colors text-sahib-950">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold text-sahib-950">Transaction History</h1>
            </div>

            <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-sahib-600" size={48} />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-4">
                        <AlertCircle size={24} />
                        <p className="font-semibold">{error}</p>
                    </div>
                ) : transactions.length > 0 ? (
                    <div className="space-y-4">
                        {transactions.map((tx, i) => {
                            const Config = TYPE_CONFIG[tx.type] || TYPE_CONFIG.CREDIT;
                            const Icon = Config.icon;

                            return (
                                <motion.div
                                    key={tx.id}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white p-4 rounded-2xl border border-sahib-100 shadow-sm flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${Config.color}`}>
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sahib-950">{tx.description || 'Transaction'}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar size={10} />
                                                {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-lg ${Config.color.split(' ')[0]}`}>
                                            {Config.sign}₦{tx.amount.toLocaleString()}
                                        </p>
                                        <p className={`text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[tx.status] || 'text-gray-500'}`}>
                                            {tx.status}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 space-y-4">
                        <div className="w-20 h-20 bg-sahib-50 rounded-full flex items-center justify-center mx-auto text-sahib-300">
                            <Wallet size={48} />
                        </div>
                        <div>
                            <p className="font-bold text-sahib-950 text-lg">No Transactions Yet</p>
                            <p className="text-gray-500">Your funding and spending history will appear here.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
