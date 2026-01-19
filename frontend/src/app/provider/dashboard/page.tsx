"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Clock, Package, CheckCircle2, Navigation, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ProviderDashboardPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            const data = await api.get('/requests/available');
            if (data.error) {
                setError(data.error);
            } else {
                setRequests(data);
            }
        } catch (err: any) {
            setError(err.message || "Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAccept = async (requestId: string) => {
        if (!confirm("Accept this job?")) return;
        setProcessingId(requestId);
        try {
            // Using a dummy provider ID for now since we don't have separate provider auth yet
            await api.patch(`/requests/${requestId}/accept`, { providerId: 'provider-dev-1' });
            // Refresh list
            fetchRequests();
        } catch (err: any) {
            alert(err.message || "Failed to accept job");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl">
            {/* Header */}
            <div className="p-6 bg-sahib-950 text-white sticky top-0 z-10 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold">Provider Dashboard</h1>
                    <Link href="/dashboard" className="text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">
                        Switch to User
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sahib-600 rounded-xl flex items-center justify-center font-bold text-xl">
                        SP
                    </div>
                    <div>
                        <p className="font-bold text-lg">Dev Provider</p>
                        <p className="text-sahib-400 text-xs">Rating: 5.0 ★</p>
                    </div>
                </div>
            </div>

            <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <Package size={20} className="text-sahib-600" />
                    Available Jobs
                </h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-sahib-600" size={32} />
                    </div>
                ) : requests.length > 0 ? (
                    <div className="space-y-4">
                        {requests.map((req, i) => (
                            <motion.div
                                key={req.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-1.5 bg-sahib-50 text-sahib-700 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                                            {req.priority || 'NORMAL'}
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg">Service Request</h3>
                                    </div>
                                    <span className="font-black text-xl text-sahib-600">₦{req.price.toLocaleString()}</span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3">
                                        <MapPin size={18} className="text-gray-400 mt-0.5" />
                                        <p className="text-gray-600 text-sm font-medium">{req.location?.address || "Location Hidden"}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock size={18} className="text-gray-400" />
                                        <p className="text-gray-600 text-sm font-medium">Posted {new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAccept(req.id)}
                                    disabled={!!processingId}
                                    className="w-full py-3 bg-sahib-950 text-white rounded-xl font-bold text-sm hover:bg-sahib-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processingId === req.id ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            <CheckCircle2 size={18} />
                                            Accept Job
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-900 font-bold">No Jobs Available</p>
                        <p className="text-gray-500 text-sm">Check back later for new requests.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
