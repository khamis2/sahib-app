"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Package,
    ShoppingBag,
    Wrench,
    MapPin,
    ShieldCheck,
    Clock,
    ArrowRight,
    TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function Home() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('user'));
    }, []);

    const requestLink = isLoggedIn ? "/dashboard/request" : "/auth";

    return (
        <div className="bg-sahib-50 min-h-screen">
            <main className="max-w-md mx-auto px-6 py-8 md:max-w-2xl lg:max-w-4xl overflow-hidden bg-white min-h-screen shadow-2xl">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 max-w-md mx-auto">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="glass rounded-[2rem] px-6 py-3 flex justify-between items-center bg-white/50 backdrop-blur-2xl border border-white/40 shadow-xl shadow-sahib-500/5"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-sahib-600 rounded-lg flex items-center justify-center text-white font-black text-lg">
                                S
                            </div>
                            <h1 className="text-lg font-black tracking-tight text-sahib-950">Sahib</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            {isLoggedIn ? (
                                <Link href="/dashboard" className="bg-sahib-600 text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-sahib-700 transition-colors tap-active">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/auth" className="text-sahib-600 font-bold text-xs hover:underline">
                                        Login
                                    </Link>
                                    <Link href="/auth" className="bg-sahib-950 text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-sahib-800 transition-colors tap-active">
                                        Join
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                </header>

                <div className="pt-24"></div> {/* Spacer for fixed header */}

                {/* Hero Section */}
                <section className="mb-12">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="text-sahib-600 font-bold text-xs mb-3 block uppercase tracking-[0.2em]">Trusted & Fast Service</span>
                        <h2 className="text-5xl font-extrabold leading-[1.1] mb-5 text-sahib-950 tracking-tight">
                            Urgent Help for Your <span className="text-gradient">Daily Needs</span>
                        </h2>
                        <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
                            Connect with verified professionals for delivery, errands, and repairs. Safe, secure, and fully halal.
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href={requestLink} className="w-full group">
                            <button className="btn-primary w-full group py-4">
                                Request a Service
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link href="/auth" className="w-full">
                            <button className="btn-secondary w-full py-4">
                                Become a Provider
                            </button>
                        </Link>
                    </motion.div>
                </section>

                {/* Services Grid */}
                <motion.section
                    className="mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="flex justify-between items-end mb-8">
                        <h3 className="text-2xl font-bold text-sahib-950">Our Services</h3>
                        <button className="text-sahib-600 text-sm font-bold hover:underline">View All</button>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {[
                            { icon: Package, label: "Delivery", color: "bg-blue-50 text-blue-600", desc: "Fast & Safe" },
                            { icon: ShoppingBag, label: "Groceries", color: "bg-green-50 text-green-600", desc: "Fresh Items" },
                            { icon: Clock, label: "Errands", color: "bg-purple-50 text-purple-600", desc: "Save Time" },
                            { icon: Wrench, label: "Repairs", color: "bg-orange-50 text-orange-600", desc: "Expert Fixing" }
                        ].map((service, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="card flex flex-col items-start gap-4 cursor-pointer group"
                            >
                                <div className={`${service.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                    <service.icon size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sahib-950 text-lg">{service.label}</h4>
                                    <p className="text-xs text-gray-400 font-medium">{service.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Features Bar (Outstanding Section) */}
                <motion.div
                    className="p-8 rounded-[2.5rem] bg-sahib-950 text-white relative overflow-hidden mb-12"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-sahib-600 p-3 rounded-2xl text-white shadow-lg">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black">100% Secure Flow</h4>
                                <p className="text-sahib-400 text-xs font-bold uppercase tracking-widest mt-1">Verified by Sahib Trust</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                                <span className="text-sahib-400 text-[10px] font-black uppercase block mb-1">Success Rate</span>
                                <span className="text-2xl font-black">99.9%</span>
                            </div>
                            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                                <span className="text-sahib-400 text-[10px] font-black uppercase block mb-1">Active SPs</span>
                                <span className="text-2xl font-black">2.5k+</span>
                            </div>
                        </div>

                        <div className="flex -space-x-3 items-center pt-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <img
                                    key={i}
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=provider${i}`}
                                    className="w-10 h-10 rounded-full border-4 border-sahib-950 bg-sahib-800"
                                    alt="Provider"
                                />
                            ))}
                            <div className="px-4 text-xs font-bold text-sahib-400">Join our verified elite</div>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-64 h-64 bg-sahib-600/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                </motion.div>

                {/* Footer Area Placeholder */}
                <div className="mt-16 text-center">
                    <p className="text-gray-400 text-xs font-medium">© 2026 Sahib Services. All rights reserved.</p>
                </div>
            </main>
        </div>
    );
}
