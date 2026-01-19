"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Heart, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<any[]>([]); // Empty for now

    return (
        <div className="bg-sahib-50 min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl">
            {/* Header */}
            <div className="p-6 flex items-center gap-4 bg-white sticky top-0 z-10 border-b border-sahib-50">
                <Link href="/dashboard" className="p-2 hover:bg-sahib-50 rounded-full transition-colors text-sahib-950">
                    <ArrowLeft size={24} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-sahib-950">Favorites</h1>
                </div>
                <button className="p-2 bg-sahib-50 rounded-full text-sahib-400">
                    <Search size={20} />
                </button>
            </div>

            <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-sahib-50 rounded-full flex items-center justify-center mb-6 text-sahib-200">
                    <Heart size={48} />
                </div>
                <h3 className="text-xl font-bold text-sahib-950 mb-2">No Favorites Yet</h3>
                <p className="text-gray-500 text-sm max-w-[200px] mb-8">
                    Save your favorite service providers here for quick access.
                </p>
                <Link href="/dashboard" className="bg-sahib-950 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-sahib-800 transition-colors">
                    Find Services
                </Link>
            </main>
        </div>
    );
}
