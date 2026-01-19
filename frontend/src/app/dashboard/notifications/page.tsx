"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Bell, Calendar, CheckCircle2, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "success",
            title: "Wallet Funded",
            message: "You successfully funded your wallet with ₦50,000.",
            time: "2 mins ago",
            read: false
        },
        {
            id: 2,
            type: "info",
            title: "Welcome to Sahib",
            message: "Get started by requesting your first service!",
            time: "1 hour ago",
            read: true
        }
    ]);

    return (
        <div className="bg-sahib-50 min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl">
            {/* Header */}
            <div className="p-6 flex items-center gap-4 bg-white sticky top-0 z-10 border-b border-sahib-50">
                <Link href="/dashboard" className="p-2 hover:bg-sahib-50 rounded-full transition-colors text-sahib-950">
                    <ArrowLeft size={24} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-sahib-950">Notifications</h1>
                </div>
                <div className="relative">
                    <Bell size={24} className="text-sahib-950" />
                    {notifications.some(n => !n.read) && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                </div>
            </div>

            <main className="flex-1 p-4 space-y-4 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map((notif, i) => (
                        <motion.div
                            key={notif.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-4 rounded-2xl border ${notif.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100'} flex gap-4`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                    notif.type === 'alert' ? 'bg-red-100 text-red-600' :
                                        'bg-blue-100 text-blue-600'
                                }`}>
                                {notif.type === 'success' ? <CheckCircle2 size={20} /> :
                                    notif.type === 'alert' ? <AlertCircle size={20} /> :
                                        <Info size={20} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold text-sm ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</h3>
                                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">{notif.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{notif.message}</p>
                            </div>
                            {!notif.read && (
                                <div className="self-center w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 opacity-50">
                        <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="font-bold text-gray-400">No notifications</p>
                    </div>
                )}
            </main>
        </div>
    );
}
