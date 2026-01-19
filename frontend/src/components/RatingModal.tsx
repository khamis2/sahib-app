"use client";

import { motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";

interface RatingModalProps {
    requestId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function RatingModal({ requestId, onClose, onSuccess }: RatingModalProps) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setLoading(true);
        try {
            await api.post(`/requests/${requestId}/rate`, { rating, review });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to submit rating", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-sm relative"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-sahib-50 text-gray-400 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-sahib-950">Rate Provider</h2>
                        <p className="text-gray-500 text-sm mt-1">How was your service?</p>
                    </div>

                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110 active:scale-90"
                            >
                                <Star
                                    size={36}
                                    className={`${star <= (hoveredRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-200"
                                        } transition-colors duration-200`}
                                />
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write a review (optional)..."
                        className="w-full bg-sahib-50 rounded-2xl p-4 text-sm font-medium resize-none border-none focus:ring-2 focus:ring-sahib-600 transition-all placeholder:text-gray-400"
                        rows={3}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={loading || rating === 0}
                        className="w-full py-4 bg-sahib-950 text-white rounded-2xl font-bold shadow-lg shadow-sahib-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sahib-800 transition-colors"
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
