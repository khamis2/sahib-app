"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, User, Phone, CheckCircle2, XCircle, Loader2, AlertCircle, Package, Wrench, Star } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Confetti } from "@/components/ui/Confetti";
import { RatingModal } from "@/components/RatingModal";

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    ACCEPTED: 'bg-blue-100 text-blue-700 border-blue-200',
    COMPLETED: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

const STATUS_ICONS: Record<string, any> = {
    PENDING: Clock,
    ACCEPTED: User,
    COMPLETED: CheckCircle2,
    CANCELLED: XCircle,
};

export default function RequestDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const requestId = params.id as string;

    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelling, setCancelling] = useState(false);
    const [showRating, setShowRating] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const data = await api.get(`/requests/${requestId}`);
                if (data.error) {
                    setError(data.error);
                } else {
                    setRequest(data);
                    // Show rating modal if completed and not rated
                    if (data.status === 'COMPLETED' && !data.rating) {
                        setShowRating(true);
                    }
                }
            } catch (err: any) {
                setError(err.message || "Failed to load request");
            } finally {
                setLoading(false);
            }
        };

        if (requestId) {
            fetchRequest();
        }
    }, [requestId]);

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this request? You will receive a refund.")) return;

        setCancelling(true);
        try {
            const result = await api.post(`/requests/${requestId}/cancel`, {});
            if (result.error) {
                throw new Error(result.error);
            }
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || "Failed to cancel request");
        } finally {
            setCancelling(false);
        }
    };

    const handleRatingSuccess = () => {
        window.location.reload();
    };

    const StatusIcon = request ? STATUS_ICONS[request.status] || Clock : Clock;

    return (
        <div className="bg-sahib-50 min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl">
            {showRating && (
                <RatingModal
                    requestId={requestId}
                    onClose={() => setShowRating(false)}
                    onSuccess={handleRatingSuccess}
                />
            )}

            {/* Header */}
            <div className="p-6 flex items-center gap-4 bg-white sticky top-0 z-10 border-b border-sahib-50">
                <Link href="/dashboard" className="p-2 hover:bg-sahib-50 rounded-full transition-colors text-sahib-950">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold text-sahib-950">Request Details</h1>
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
                ) : request ? (
                    <>
                        {/* Status Badge */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-sm ${STATUS_COLORS[request.status] || STATUS_COLORS.PENDING}`}
                        >
                            <StatusIcon size={18} />
                            {request.status}
                        </motion.div>

                        {/* Main Card */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-sahib-950 rounded-3xl p-6 text-white relative overflow-hidden"
                        >
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-sahib-600 rounded-2xl flex items-center justify-center">
                                        <Package size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold">Service Request</h2>
                                        <p className="text-sahib-400 text-sm">ID: {request.id.slice(0, 8)}...</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-sahib-800 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sahib-400">Amount</span>
                                        <span className="font-bold text-xl">₦{request.price?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sahib-400">Priority</span>
                                        <span className="font-semibold">{request.priority}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sahib-400">Created</span>
                                        <span className="font-semibold">{new Date(request.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-sahib-600/20 rounded-full blur-3xl"></div>
                        </motion.div>

                        {/* Location */}
                        <div className="bg-sahib-50 rounded-2xl p-5 space-y-3">
                            <h3 className="font-bold text-sahib-950 flex items-center gap-2">
                                <MapPin size={18} className="text-sahib-600" />
                                Location
                            </h3>
                            <p className="text-gray-600 font-medium">
                                {request.location?.address || "No address provided"}
                            </p>
                        </div>

                        {/* Provider Info (if assigned) */}
                        {request.providerId && (
                            <div className="bg-sahib-50 rounded-2xl p-5 space-y-3">
                                <h3 className="font-bold text-sahib-950 flex items-center gap-2">
                                    <User size={18} className="text-sahib-600" />
                                    Service Provider
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-sahib-600 rounded-full flex items-center justify-center text-white font-bold">
                                        SP
                                    </div>
                                    <div>
                                        <p className="font-bold text-sahib-950">Sahib Partner</p>
                                        <p className="text-sm text-gray-500">Assigned Provider</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Provider Simulation Actions (Dev Only) */}
                        <div className="border-t-2 border-dashed border-gray-200 pt-6 mt-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Wrench size={14} />
                                Provider Simulation
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {request.status === 'PENDING' && (
                                    <button
                                        onClick={async () => {
                                            if (confirm("Simulate provider accepting this request?")) {
                                                setLoading(true);
                                                await api.patch(`/requests/${requestId}/accept`, { providerId: 'simulated-provider-123' });
                                                window.location.reload();
                                            }
                                        }}
                                        className="p-3 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                                    >
                                        Simulate Accept
                                    </button>
                                )}
                                {request.status === 'ACCEPTED' && (
                                    <button
                                        onClick={async () => {
                                            if (confirm("Simulate provider completing this request? Funds will be released.")) {
                                                setLoading(true);
                                                await api.patch(`/requests/${requestId}/complete`, {});
                                                window.location.reload();
                                            }
                                        }}
                                        className="p-3 bg-green-50 text-green-600 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors"
                                    >
                                        Simulate Complete
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {request.status === 'PENDING' && (
                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className="w-full py-4 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors disabled:opacity-50"
                                >
                                    {cancelling ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <XCircle size={20} />
                                            Cancel Request & Get Refund
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {request.status === 'COMPLETED' && (
                            <div className="bg-green-50 rounded-2xl p-5 text-center relative overflow-hidden">
                                <Confetti />
                                <div className="relative z-10">
                                    <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
                                    <p className="font-bold text-green-700">Request Completed!</p>
                                    <p className="text-sm text-green-600 mt-1">Thank you for using Sahib Services</p>
                                    {request.rating && (
                                        <div className="flex items-center justify-center gap-1 mt-3 text-yellow-500">
                                            {Array.from({ length: request.rating }).map((_, i) => (
                                                <Star key={i} size={16} fill="currentColor" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
            </main>
        </div>
    );
}
