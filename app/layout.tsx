import "@/styles/globals.css";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { ReactNode } from "react";

import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";

export const metadata = {
	title: "NextUI App",
	description: "Authenticated App with NextUI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased"
				)}
			>
				<Providers>
					<div className="relative flex flex-col h-screen">
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
				</Providers>
			</body>
		</html>
	);
}
