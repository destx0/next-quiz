"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import dynamic from "next/dynamic";
import useAuthStore from "@/lib/zustand";

const DynamicQuizBatches = dynamic(() => import("./QuizBatches"), {
	ssr: false,
	loading: () => <p>Loading quiz batches...</p>,
});

export default function SSC() {
	const { user, loading } = useAuthStore();

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<Card className="mb-4">
				<CardHeader>
					<h1 className="text-2xl font-bold">
						SSC (Staff Selection Commission) Tests
					</h1>
				</CardHeader>
				<CardBody>
					{user ? (
						<p>
							Welcome, {user.displayName || user.email}! Here you
							can find and take SSC preparation tests.
						</p>
					) : (
						<p>Please log in to access SSC tests.</p>
					)}
				</CardBody>
			</Card>

			{user && <DynamicQuizBatches />}
		</div>
	);
}
