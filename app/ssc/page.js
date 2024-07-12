"use client";
import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import QuizBatches from "./QuizBatches";

export default function SSCPage() {
	return (
		<div className="container mx-auto p-4">
			<Card className="mb-4">
				<CardHeader>
					<h1 className="text-2xl font-bold">
						SSC (Staff Selection Commission) Tests
					</h1>
				</CardHeader>
				<CardBody>
					<p>
						Welcome to the SSC test preparation page. Here you can
						find and take SSC preparation tests.
					</p>
				</CardBody>
			</Card>

			<QuizBatches />
		</div>
	);
}
