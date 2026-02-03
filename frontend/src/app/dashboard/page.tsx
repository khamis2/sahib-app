"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Bell, User as UserIcon, Wallet, Plus, Package, ShoppingBag, Clock, Wrench, Menu, MoreHorizontal, Loader2, Navigation as NavigationIcon, Star as StarIcon, History as HistoryIcon, Settings as SettingsIcon, MoreVertical } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage
        const savedUser = localStorage.getItem('user');
        let userId = '';
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            userId = parsed.id;
        }

        // Fetch dashboard data from backend
        const fetchDashboardData = async () => {
            try {
                // Fetch live user data (including updated balance)
                if (userId) {
                    const liveUser = await api.get(`/users/${userId}`);
                    if (liveUser && !liveUser.error) {
                        setUser(liveUser);
                        localStorage.setItem('user', JSON.stringify(liveUser));
                    }
                }

                // Fetch requests
                const data = await api.get('/requests');
                setRequests(data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const activeRequests = requests.filter(r => r.status === 'PENDING' || r.status === 'ACCEPTED');
    return (
        <div className="bg-sahib-50 min-h-screen pb-24 max-w-md mx-auto bg-white shadow-2xl relative">
            {/* Top Bar */}
            <div className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-20 border-b border-sahib-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sahib-600 rounded-2xl flex items-center justify-center text-white p-0.5 overflow-hidden shadow-lg shadow-sahib-500/20 tap-active">
                        <img
                            src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.phoneNumber || 'Sahib'}`}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-xl"
                        />
                    </div>
                    <div>
                        <h2 className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] leading-none mb-1">Welcome</h2>
                        <p className="font-extrabold text-sahib-950 text-sm">{user?.fullName?.split(' ')[0] || user?.phoneNumber || 'Sahib User'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Link href="/provider/dashboard" className="px-3 py-1.5 bg-sahib-50 rounded-full text-sahib-600 hover:bg-sahib-600 hover:text-white transition-all font-bold text-[10px] uppercase tracking-wider">
                        SP Mode
                    </Link>
                    <Link href="/dashboard/notifications" className="p-2 text-sahib-400 hover:text-sahib-600 tap-active relative">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </Link>
                    <Link href="/dashboard/settings" className="p-2 text-sahib-400 hover:text-sahib-600 tap-active">
                        <SettingsIcon size={20} />
                    </Link>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Wallet Balance */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-sahib-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl"
                >
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sahib-400 font-bold text-xs uppercase tracking-[0.2em]">Wallet Balance</span>
                            <h3 className="text-4xl font-extrabold flex items-baseline gap-1">
                                <span className="text-sahib-500 text-2xl font-bold">₦</span>
                                {loading ? '...' : (user?.balance || 0).toLocaleString()}<span className="text-sahib-400 text-lg">.00</span>
                            </h3>
                        </div>
                        <button className="bg-sahib-800 p-2.5 rounded-2xl hover:bg-sahib-700 transition-colors">
                            <Wallet size={24} />
                        </button>
                    </div>
                    <div className="mt-8 flex gap-3 relative z-10">
                        <Link href="/dashboard/fund" className="bg-white text-sahib-950 px-6 py-2.5 rounded-2xl font-bold text-sm hover:scale-105 transition-transform">
                            Fund Wallet
                        </Link>
                        <Link href="/dashboard/history" className="bg-sahib-800 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:scale-105 transition-transform">
                            History
                        </Link>
                    </div>
                    {/* Abstract Decorations */}
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-sahib-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute -left-10 -top-10 w-32 h-32 bg-sahib-500/10 rounded-full blur-2xl"></div>
                </motion.div>

                {/* Quick Search */}
                <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for services..."
                        className="w-full pl-14 pr-6 py-5 bg-sahib-50 rounded-3xl outline-none font-bold text-sahib-950 placeholder:text-gray-400 border border-transparent focus:border-sahib-100 transition-all"
                    />
                </div>

                {/* Active Tasks */}
                <section>
                    <div className="flex justify-between items-end mb-5">
                        <h3 className="text-xl font-extrabold text-sahib-950">Active Requests</h3>
                        <span className="text-xs font-bold text-sahib-600 bg-sahib-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                            {activeRequests.length} {activeRequests.length === 1 ? 'Task' : 'Tasks'}
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4 text-gray-400">
                            <Loader2 className="animate-spin" size={32} />
                            <p className="text-sm font-medium">Fetching your requests...</p>
                        </div>
                    ) : activeRequests.length > 0 ? (
                        <div className="space-y-4">
                            {activeRequests.map((req, i) => (
                                <Link href={`/dashboard/request/${req.id}`} key={req.id}>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="card bg-gradient-to-br from-sahib-600 to-sahib-800 border-none text-white p-6 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform hover-glow"
                                    >
                                        <div className="relative z-10 flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg leading-none mb-1">Service Request</h4>
                                                    <span className="text-xs text-sahib-200 flex items-center gap-1">
                                                        <NavigationIcon size={12} /> {req.location?.address || 'Location Hidden'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md">
                                                <span className="text-xs font-bold uppercase tracking-widest">{req.status}</span>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full border-2 border-white/50 overflow-hidden bg-sahib-500 flex items-center justify-center">
                                                    <span className="text-[10px] font-bold">SP</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{req.provider ? req.provider.userId : 'Finding Provider'}</p>
                                                    <p className="text-[10px] text-sahib-200">{req.provider ? 'Sahib Partner' : 'System Matching'}</p>
                                                </div>
                                            </div>
                                            <p className="text-lg font-black tracking-tighter">₦{req.price.toLocaleString()}</p>
                                        </div>
                                        <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-sahib-50 rounded-3xl p-10 text-center space-y-4 border-2 border-dashed border-sahib-100">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-sahib-200 shadow-sm">
                                <Clock size={32} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sahib-950">No active requests</h4>
                                <p className="text-xs text-gray-500 font-medium mt-1">Ready to help when you need us.</p>
                            </div>
                            <button className="text-sahib-600 text-sm font-bold hover:underline">Start a Request</button>
                        </div>
                    )}
                </section>

                {/* Service Categories Section */}
                <section>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-xl font-extrabold text-sahib-950 px-1">How can we help?</h3>
                        <span className="text-[10px] font-black text-sahib-500 uppercase tracking-widest bg-sahib-50 px-2 py-1 rounded-md">24/7 Available</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 staggered-list">
                        {[
                            { icon: Package, label: "Delivery", color: "from-blue-500/10 to-blue-600/5 text-blue-600", desc: "Send anything", link: "/dashboard/request?type=delivery" },
                            { icon: Wrench, label: "Repairs", color: "from-orange-500/10 to-orange-600/5 text-orange-600", desc: "Fix anything", link: "/dashboard/request?type=repair" },
                            { icon: ShoppingBag, label: "Groceries", color: "from-green-500/10 to-green-600/5 text-green-600", desc: "Daily needs", link: "/dashboard/request?type=groceries" },
                            { icon: StarIcon, label: "Favorites", color: "from-yellow-500/10 to-yellow-600/5 text-yellow-600", desc: "Quick access", link: "/dashboard/favorites" }
                        ].map((cat, i) => (
                            <Link href={cat.link} key={i} className="group tap-active block">
                                <div className={`bg-gradient-to-br ${cat.color} p-6 rounded-[2.5rem] border border-white relative overflow-hidden h-full`}>
                                    <div className="relative z-10 space-y-3">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                            <cat.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sahib-950 text-sm">{cat.label}</h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{cat.desc}</p>
                                        </div>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full blur-2xl group-hover:bg-white/40 transition-colors"></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Professional Promotion (Outstanding Feature) */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-sahib-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-sahib-500/20"
                >
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full w-fit">
                            <StarIcon size={14} className="fill-white" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Sahib Pro</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black leading-tight">Zero-Stress<br />Subscription</h3>
                            <p className="text-sahib-100 text-sm font-medium mt-2">Get 50% discount on all service delivery fees with Sahib Pro.</p>
                        </div>
                        <button className="bg-white text-sahib-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform w-fit">
                            Join Now
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-sahib-400/20 -translate-x-1/2 translate-y-1/2 rounded-full blur-2xl"></div>
                </motion.div>
            </div>

            {/* Floating Action Button */}
            <Link href="/dashboard/request" className="fixed bottom-28 right-6 z-30">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 bg-sahib-600 text-white rounded-3xl shadow-2xl shadow-sahib-600/40 flex items-center justify-center"
                >
                    <Plus size={32} />
                </motion.button>
            </Link>

            {/* Navigation Bar */}
            <div className="fixed bottom-6 left-6 right-6 flex justify-between items-center bg-sahib-950/90 backdrop-blur-xl p-4 rounded-[2rem] shadow-2xl border border-white/10 max-w-[calc(448px-3rem)] mx-auto z-50">
                <Link href="/dashboard" className="text-white bg-sahib-600 p-3 rounded-2xl shadow-lg shadow-sahib-600/30 tap-active">
                    <NavigationIcon size={24} />
                </Link>
                <Link href="/dashboard/history" className="text-sahib-400 p-3 hover:text-white transition-colors tap-active">
                    <HistoryIcon size={24} />
                </Link>
                <div className="w-px h-6 bg-white/10 mx-2"></div>
                <Link href="/dashboard/fund" className="text-sahib-400 p-3 hover:text-white transition-colors tap-active">
                    <Wallet size={24} />
                </Link>
                <Link href="/dashboard/favorites" className="text-sahib-400 p-3 hover:text-white transition-colors tap-active">
                    <StarIcon size={24} />
                </Link>
            </div>
        </div>
    );
}
