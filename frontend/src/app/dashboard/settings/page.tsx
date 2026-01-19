"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Phone, Camera, Loader2, CheckCircle2, Save } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setFormData({
                fullName: parsed.fullName || "",
                email: parsed.email || "",
            });
        }
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const result = await api.patch(`/users/${user.id}`, formData);
            if (result.error) throw new Error(result.error);

            // Update local storage and state
            const updatedUser = { ...user, ...result };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
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
                <h1 className="text-xl font-bold text-sahib-950">Profile Settings</h1>
            </div>

            <main className="flex-1 p-6 space-y-8 overflow-y-auto">
                {/* Profile Picture */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-24 h-24 bg-sahib-100 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.phoneNumber}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-sahib-600 text-white rounded-full hover:bg-sahib-700 transition-colors shadow-md">
                            <Camera size={16} />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Tap to change photo</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-sahib-950 uppercase tracking-wider flex items-center gap-2">
                            <User size={14} /> Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full p-4 bg-sahib-50 border-none rounded-2xl font-semibold text-sahib-950 focus:ring-2 focus:ring-sahib-600 transition-all placeholder:text-gray-400"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-sahib-950 uppercase tracking-wider flex items-center gap-2">
                            <Mail size={14} /> Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-4 bg-sahib-50 border-none rounded-2xl font-semibold text-sahib-950 focus:ring-2 focus:ring-sahib-600 transition-all placeholder:text-gray-400"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="space-y-2 opacity-50 pointer-events-none">
                        <label className="text-xs font-bold text-sahib-950 uppercase tracking-wider flex items-center gap-2">
                            <Phone size={14} /> Phone Number
                        </label>
                        <input
                            type="text"
                            value={user.phoneNumber}
                            readOnly
                            className="w-full p-4 bg-gray-100 border-none rounded-2xl font-semibold text-gray-500"
                        />
                        <p className="text-xs text-gray-400 px-1">Phone number cannot be changed</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                            <Loader2 className="animate-spin" size={16} />
                            {error}
                        </div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-bold flex items-center gap-2 justify-center"
                        >
                            <CheckCircle2 size={18} />
                            Profile updated successfully!
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-sahib-950 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-sahib-800 transition-all shadow-lg shadow-sahib-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}
