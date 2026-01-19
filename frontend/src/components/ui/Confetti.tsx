"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Confetti = () => {
    const [particles] = useState(() => Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100 - 50, // -50 to 50
        y: Math.random() * -100 - 50, // -50 to -150
        rotation: Math.random() * 360,
        color: ['#FFC700', '#FF0000', '#2E3192', '#41BBC7'][Math.floor(Math.random() * 4)],
        delay: Math.random() * 0.2
    })));

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] flex justify-center items-center overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{
                        x: p.x * 10,
                        y: p.y * 5,
                        opacity: 0,
                        scale: 1,
                        rotate: p.rotation * 2
                    }}
                    transition={{
                        duration: 2.5,
                        ease: "easeOut",
                        delay: p.delay
                    }}
                    style={{ backgroundColor: p.color }}
                    className="absolute w-3 h-3 rounded-full"
                />
            ))}
        </div>
    );
};
