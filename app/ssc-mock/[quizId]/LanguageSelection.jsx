import React, { useState } from "react";

const LanguageSelection = ({
	onPrevious,
	onStart,
	testName = "Sample Test",
	durationMinutes = 60,
}) => {
	const [selectedLanguage, setSelectedLanguage] = useState("");
	const [isConfirmed, setIsConfirmed] = useState(false);

	const languages = [
		{ value: "en", label: "English" },

		// Add more languages as needed
	];

	const handleLanguageChange = (e) => {
		setSelectedLanguage(e.target.value);
	};

	const handleConfirmationChange = (e) => {
		setIsConfirmed(e.target.checked);
	};

	const handleStart = () => {
		if (selectedLanguage && isConfirmed) {
			onStart(selectedLanguage);
		}
	};

	// Test information
	const numQuestions = 100;
	const marksPerQuestion = 2;
	const totalMarks = numQuestions * marksPerQuestion;

	return (
		<div className="flex flex-col h-screen bg-white">
			<div className="flex-grow p-8 overflow-auto">
				<h1 className="text-3xl font-bold mb-6">{testName}</h1>

				<div className="mb-6 p-4 bg-gray-100 rounded-md">
					<p className="font-bold mb-2">
						Duration: {durationMinutes} Minutes
					</p>
					<p className="font-bold mb-2">
						Total Questions: {numQuestions}
					</p>
					<p className="font-bold mb-2">
						Marks per Question: {marksPerQuestion}
					</p>
					<p className="font-bold mb-2">
						Maximum Marks: {totalMarks}
					</p>
					<p className="font-bold mb-4">
						Read the following instructions carefully:
					</p>
					<ol className="list-decimal list-inside space-y-2">
						<li>
							The test contains 4 sections having {numQuestions}{" "}
							questions.
						</li>
						<li>
							Each question has 4 options out of which only one is
							correct.
						</li>
						<li>
							You have to finish the test in {durationMinutes}{" "}
							minutes.
						</li>
						<li>
							You will be awarded {marksPerQuestion} marks for
							each correct answer and 0.5 will be deducted for
							each wrong answer.
						</li>
						<li>
							There is no negative marking for the questions that
							you have not attempted.
						</li>
						<li>
							You can write this test only once. Make sure that
							you complete the test before you submit the test
							and/or close the browser.
						</li>
					</ol>
				</div>
			</div>

			<div className="p-4">
				<div className="mb-6 flex">
					<label
						htmlFor="language"
						className="block text-sm font-bold text-gray-700 mb-2"
					>
						Choose your default language:
					</label>
					<select
						id="language"
						value={selectedLanguage}
						onChange={handleLanguageChange}
						className="border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">-- Select --</option>
						{languages.map((lang) => (
							<option key={lang.value} value={lang.value}>
								{lang.label}
							</option>
						))}
					</select>
				</div>

				<div className="mb-6">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={isConfirmed}
							onChange={handleConfirmationChange}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<span className="ml-2 text-sm font-bold text-gray-700">
							I have read all the instructions carefully and have
							understood them. I agree not to cheat or use unfair
							means in this examination. I understand that using
							unfair means of any sort for my own or someone
							else&apos;s advantage will lead to my immediate
							disqualification. The decision of infinitymock will
							be final in these matters and cannot be appealed.
						</span>
					</label>
				</div>
				<div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center">
					<button
						onClick={onPrevious}
						className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
					>
						Previous
					</button>
					<button
						onClick={handleStart}
						disabled={!selectedLanguage || !isConfirmed}
						className={`px-6 py-2 text-black rounded ${
							selectedLanguage && isConfirmed
								? "bg-[#92c4f2] hover:bg-blue-600"
								: "bg-gray-300 cursor-not-allowed"
						}`}
					>
						I am ready to begin
					</button>
				</div>
			</div>
		</div>
	);
};

export default LanguageSelection;
