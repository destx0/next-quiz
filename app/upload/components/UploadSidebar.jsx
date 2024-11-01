import React from "react";
import {
	Card,
	CardBody,
	Divider,
	RadioGroup,
	Radio,
	Accordion,
	AccordionItem,
} from "@nextui-org/react";
import { LANGUAGES } from "../constants";

export default function UploadSidebar({
	uploadType,
	onUploadTypeChange,
	inputMethod,
	onInputMethodChange,
	uploadVersion,
	onVersionChange,
	selectedLanguage,
	onLanguageChange,
	selectedBatch,
	onBatchChange,
	testBatches,
	onCreateNewBatch,
}) {
	const SectionTitle = ({ children }) => (
		<h3 className="text-lg font-semibold text-gray-700 mb-2">{children}</h3>
	);

	return (
		<Card className="h-full bg-gray-50">
			<CardBody className="p-6">
				<div className="space-y-6">
					<h2 className="text-2xl font-bold text-gray-800 mb-6">
						Upload Settings
					</h2>

					{/* Primary Settings - Always Visible */}
					<div className="space-y-6">
						{/* Content Type - Default to quizzes */}

						{/* Language Selection */}
						<div>
							<SectionTitle>Language</SectionTitle>
							<RadioGroup
								value={selectedLanguage}
								onValueChange={onLanguageChange}
								orientation="horizontal"
								classNames={{
									wrapper: "gap-4",
								}}
							>
								{LANGUAGES.map((lang) => (
									<Radio
										key={lang.value}
										value={lang.value}
										size="sm"
									>
										{lang.label}
									</Radio>
								))}
							</RadioGroup>
						</div>

						{uploadType === "quizzes" && (
							<>
								<Divider />
								<div>
									<div className="flex justify-between items-center mb-2">
										<SectionTitle>Test Batch</SectionTitle>
										<button
											onClick={onCreateNewBatch}
											className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
										>
											New Batch
										</button>
									</div>
									<RadioGroup
										value={selectedBatch}
										onValueChange={onBatchChange}
										orientation="vertical"
										classNames={{
											wrapper: "gap-2",
										}}
									>
										<Radio value="none">No Batch</Radio>
										{testBatches.map((batch) => (
											<Radio
												key={batch.id}
												value={batch.id}
												description={batch.description}
											>
												{batch.title}
											</Radio>
										))}
									</RadioGroup>
								</div>
							</>
						)}
					</div>

					<Divider />

					{/* Secondary Settings - In Accordion */}
					<Accordion defaultExpandedKeys={["1"]}>
						<AccordionItem
							key="1"
							aria-label="Additional Options"
							title="Additional Options"
							className="px-0"
						>
							<div className="space-y-4 px-2">
								{/* Input Method - Default to file */}
								<div>
									<SectionTitle>Input Method</SectionTitle>
									<RadioGroup
										value={inputMethod}
										onValueChange={onInputMethodChange}
										defaultValue="file"
										orientation="horizontal"
									>
										<Radio value="file">File Upload</Radio>
										<Radio value="paste">Paste JSON</Radio>
									</RadioGroup>
								</div>
								<Divider />
								<div>
									<SectionTitle>Content Type</SectionTitle>
									<RadioGroup
										value={uploadType}
										onValueChange={onUploadTypeChange}
										defaultValue="quizzes"
										orientation="horizontal"
										classNames={{
											wrapper: "gap-4",
										}}
									>
										<Radio value="quizzes">Quizzes</Radio>
										<Radio value="questions">
											Questions
										</Radio>
									</RadioGroup>
								</div>
									<Divider />

								{uploadType === "quizzes" && (
									<div>
										<SectionTitle>
											Upload Version
										</SectionTitle>
										<RadioGroup
											value={uploadVersion}
											onValueChange={onVersionChange}
											defaultValue="v2"
											orientation="horizontal"
										>
											<Radio
												value="v2"
												description="Enhanced structure with full question data"
											>
												Version 2.0
											</Radio>
											<Radio
												value="v1"
												description="Basic quiz structure"
											>
												Version 1.0
											</Radio>
										</RadioGroup>
									</div>
								)}
							</div>
						</AccordionItem>
					</Accordion>

					{/* Help Text */}
					<div className="text-xs text-gray-500 mt-4">
						<p>
							💡 Default settings: Quiz upload (v2) with file
							input method
						</p>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
