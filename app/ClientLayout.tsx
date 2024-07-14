// ClientLayout.tsx
"use client";

import React from "react";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isQuizPage = pathname.startsWith("/ssc");

	return (
		<div
			className={clsx(
				"min-h-screen bg-transparent font-sans antialiased",
				isQuizPage && "overflow-hidden"
			)}
		>
			{isQuizPage ? (
				// Full-screen layout for quiz page
				<div className="h-screen w-screen overflow-hidden">
					{children}
				</div>
			) : (
				// Regular layout for other pages
				<div className="relative flex flex-col min-h-screen">
					<Navbar />
					<main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
						{children}
					</main>
					<footer className="w-full flex items-center justify-center py-3">
						<Link
							isExternal
							className="flex items-center gap-1 text-current"
							href="https://nextui.org"
							title="nextui.org homepage"
						></Link>
					</footer>
				</div>
			)}
		</div>
	);
}
