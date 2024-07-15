import React from "react";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import Background from "@/components/Background";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isQuizPage = searchParams.get("quiz") === "true";

	return (
		<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
			<LayoutContent isQuizPage={isQuizPage}>{children}</LayoutContent>
		</ThemeProvider>
	);
}

// Separate component to handle layout and theme
function LayoutContent({
	children,
	isQuizPage,
}: {
	children: React.ReactNode;
	isQuizPage: boolean;
}) {
	const { theme, setTheme } = useTheme();

	React.useEffect(() => {
		if (isQuizPage) {
			setTheme("light");
		}
	}, [isQuizPage, setTheme, theme]);

	return (
		<div
			className={clsx(
				"min-h-screen font-sans antialiased",
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
				<>
					<Background />
					<div className="relative flex flex-col min-h-screen">
						<Navbar />
						<main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
							{children}
						</main>
					</div>
				</>
			)}
		</div>
	);
}
