"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Avatar,
	Spinner,
} from "@nextui-org/react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getCookie, deleteCookie } from "cookies-next";

export default function Dashboard() {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const authToken = getCookie("authToken");
		if (!authToken) {
			router.push("/login");
		} else {
			const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
				if (currentUser) {
					setUser(currentUser);
				} else {
					deleteCookie("authToken");
					router.push("/login");
				}
				setLoading(false);
			});

			return () => unsubscribe();
		}
	}, [router]);

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			deleteCookie("authToken");
			router.push("/login");
		} catch (error) {
			console.error("Error signing out", error);
		}
	};

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Spinner size="lg" />
			</div>
		);

	if (!user) return null;

	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
			<Card className="w-full max-w-md">
				<CardHeader className="flex gap-3">
					<Avatar
						src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${user.email}`}
						size="lg"
					/>
					<div className="flex flex-col">
						<p className="text-md">Welcome back</p>
						<p className="text-small text-default-500">
							{user.email}
						</p>
					</div>
				</CardHeader>
				<CardBody className="text-center">
					<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
					<p className="mb-4">
						You&rsquo;re successfully logged in as {user.email}!
					</p>
					<Button
						color="danger"
						variant="flat"
						onClick={handleSignOut}
					>
						Sign Out
					</Button>
				</CardBody>
			</Card>
		</div>
	);
}
