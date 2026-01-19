import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Sahib Services | Trusted Help, Instantly",
    description: "Connect with trusted service providers for urgent daily needs in Nigeria. Fully halal, fully trusted.",
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    themeColor: "#0284c7",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "900"], variable: '--font-outfit' });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${outfit.variable} font-sans bg-sahib-50 text-sahib-950`}>
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-[20%] left-[10%] w-[40rem] h-[40rem] bg-sahib-300/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-sahib-500/10 rounded-full blur-[80px] animate-float"></div>
                </div>
                <div className="relative z-10">
                    {children}
                </div>
            </body>
        </html>
    );
}
