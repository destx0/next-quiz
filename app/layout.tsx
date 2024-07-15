// layout.tsx
import React from "react";
import "@/styles/globals.css";
import { Providers } from "./providers";
import Background from "@/components/Background";
import { ClientLayout } from "./ClientLayout";

export const metadata = {
	title: "NextUI App",
	description: "Authenticated App with NextUI",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body>
				<Providers>
					{/* <Background /> */}
					<ClientLayout>{children}</ClientLayout>
				</Providers>
			</body>
		</html>
	);
}
