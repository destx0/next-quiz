"use client";
import { useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import ManualQuestionForm from "./ManualQuestionForm";
import BulkUploadForm from "./BulkUploadForm";
import QuizForm from "./QuizForm";
import TestBatchForm from "./TestBatchForm";

export default function UploadPage() {
	const [activeTab, setActiveTab] = useState("manual");

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">
				Upload Questions, Quizzes, and Test Batches
			</h1>
			<Tabs activeKey={activeTab} onSelectionChange={setActiveTab}>
				<Tab key="manual" title="Manual Upload">
					<Card>
						<CardBody>
							<ManualQuestionForm />
						</CardBody>
					</Card>
				</Tab>
				<Tab key="bulk" title="Bulk Upload">
					<Card>
						<CardBody>
							<BulkUploadForm />
						</CardBody>
					</Card>
				</Tab>
				<Tab key="quiz" title="Create Quiz">
					<Card>
						<CardBody>
							<QuizForm />
						</CardBody>
					</Card>
				</Tab>
				<Tab key="testBatch" title="Create Test Batch">
					<Card>
						<CardBody>
							<TestBatchForm />
						</CardBody>
					</Card>
				</Tab>
			</Tabs>
		</div>
	);
}
