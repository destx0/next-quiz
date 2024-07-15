"use client";

import React, { Suspense } from "react";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import Background from "@/components/Background";

function SearchParamsWrapper({ children }: { children: React.ReactNode }) {
	const searchParams = useSearchParams();
	const isQuizPage = searchParams.get("quiz") == "true";
	return <>{children}</>; // Just render children, passing isQuizPage via context
}

// Create a context for isQuizPage
const QuizContext = React.createContext(false);

export function ClientLayout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
			<Suspense fallback={<div>Loading...</div>}>
				<SearchParamsWrapper>
					<QuizContext.Consumer>
						{(isQuizPage) => (
							<LayoutContent isQuizPage={isQuizPage}>
								{children}
							</LayoutContent>
						)}
					</QuizContext.Consumer>
				</SearchParamsWrapper>
			</Suspense>
		</ThemeProvider>
	);
}

function LayoutContent({
	children,
	isQuizPage,
}: {
	children: React.ReactNode;
	isQuizPage: boolean;
}) {
	const { theme, setTheme } = useTheme();
	const pathname = usePathname();

	React.useEffect(() => {
		if (isQuizPage) {
			setTheme("light");
		}
	}, [isQuizPage, setTheme]);

	return (
		<div
			className={clsx(
				"min-h-screen font-sans antialiased",
				isQuizPage && "overflow-hidden"
			)}
		>
			{isQuizPage ? (
				<div className="h-screen w-screen overflow-hidden">
					{children}
				</div>
			) : (
				<>
					<Background />
					<div className="relative flex flex-col min-h-screen">
						<Navbar />
						<main className="container mx-auto max-w-7xl  p-4 flex-grow">
							{children}
						</main>
					</div>
				</>
			)}
		</div>
	);
}
