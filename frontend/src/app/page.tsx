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
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex justify-between items-center mb-10"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-sahib-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sahib-500/20">
                            S
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-sahib-950">Sahib<span className="text-sahib-600">Services</span></h1>
                    </div>
                    {isLoggedIn && (
                        <Link href="/dashboard" className="bg-sahib-50 px-4 py-2 rounded-full text-sahib-600 font-bold text-sm hover:bg-sahib-100 transition-colors">
                            Dashboard
                        </Link>
                    )}
                </motion.div>

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

                {/* Features Bar */}
                <motion.div
                    className="glass p-6 rounded-3xl flex justify-between items-center bg-gradient-to-r from-sahib-50 to-white"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-sahib-600 p-3 rounded-2xl text-white shadow-lg shadow-sahib-500/30">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-sahib-400 font-bold uppercase tracking-wider">Verified by</span>
                            <span className="text-lg font-extrabold text-sahib-950">SafePass+</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sahib-600 bg-white px-4 py-2 rounded-full shadow-sm border border-sahib-100">
                        <TrendingUp size={18} />
                        <span className="text-sm font-bold">99% Success</span>
                    </div>
                </motion.div>

                {/* Footer Area Placeholder */}
                <div className="mt-16 text-center">
                    <p className="text-gray-400 text-xs font-medium">© 2026 Sahib Services. All rights reserved.</p>
                </div>
            </main>
        </div>
    );
}
