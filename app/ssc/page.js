"use client";
import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import QuizBatches from "./QuizBatches";

export default function SSCPage() {
	return (
		<div className="container mx-auto p-4">
			<QuizBatches />
		</div>
	);
}
