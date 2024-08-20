"use client";
import React, { useState } from "react";
import LanguageSelection from "./LanguageSelection";

const QuestionStatusIcon = ({
	isActive,
	isAnswered,
	isVisited,
	isMarked,
	number,
	size = 20,
}) => {
	let viewBox = "0 0 224 186";
	let shape = null;
	let textColor =
		isActive || (!isVisited && !isAnswered && !isMarked)
			? "black"
			: "white";

	if (isActive) {
		shape = (
			<rect
				x="4"
				y="4"
				width="216"
				height="178"
				rx="89"
				ry="89"
				fill="#fff"
				stroke="#000"
				strokeWidth="8"
				strokeMiterlimit="10"
			/>
		);
	} else if (isMarked && isAnswered) {
		viewBox = "0 0 251.3 215.23";
		shape = (
			<>
				<rect
					x="0"
					y="37.23"
					width="216"
					height="178"
					rx="89"
					ry="89"
					fill="#9b59b6"
				/>
				<polyline
					points="95 51.23 138 102.23 244 8.23"
					fill="none"
					stroke="#27ae60"
					strokeWidth="22"
					strokeMiterlimit="10"
				/>
			</>
		);
	} else if (isAnswered) {
		viewBox = "0 0 197.5 178";
		shape = (
			<path
				d="m82.54,0h29.66c47.08,0,85.3,38.22,85.3,85.3v92.7H0v-95.46C0,36.99,36.99,0,82.54,0Z"
				fill="#22C55E"
			/>
		);
	} else if (isMarked) {
		viewBox = "0 0 216 178";
		shape = (
			<rect
				x="0"
				y="0"
				width="216"
				height="178"
				rx="89"
				ry="89"
				fill="#9b59b6"
			/>
		);
	} else if (isVisited) {
		viewBox = "0 0 216 178";
		shape = (
			<path
				d="m0,0h216v89c0,49.12-39.88,89-89,89h-38C39.88,178,0,138.12,0,89V0h0Z"
				fill="#c0392b"
			/>
		);
	} else {
		shape = (
			<rect
				x="4"
				y="4"
				width="216"
				height="178"
				fill="#fff"
				stroke="#000"
				strokeWidth="8"
				strokeMiterlimit="10"
			/>
		);
	}

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox={viewBox}
			width={size}
			height={size}
		>
			{shape}
			{number && (
				<text
					x="50%"
					y="50%"
					dominantBaseline="middle"
					textAnchor="middle"
					fill={textColor}
					fontSize={size * 0.7}
					fontWeight="bold"
				>
					{number}
				</text>
			)}
		</svg>
	);
};

const InstructionItem = ({ children }) => <li className="mb-4">{children}</li>;

const StatusItem = ({ icon, description }) => (
	<div className="flex items-center mb-2">
		<div className="mr-2">{icon}</div>
		<span>{description}</span>
	</div>
);

const TermsAndConditions = ({ onStartQuiz, testName, duration }) => {
	const [currentStep, setCurrentStep] = useState("terms");

	const handleAcceptTerms = () => {
		setCurrentStep("language");
	};

	const handlePreviousToTerms = () => {
		setCurrentStep("terms");
	};

	const handleStartQuiz = (language) => {
		onStartQuiz(language);
	};

	if (currentStep === "language") {
		return (
			<LanguageSelection
				onPrevious={handlePreviousToTerms}
				onStart={handleStartQuiz}
				testName={testName}
				duration={duration}
			/>
		);
	}

	return (
		<div className="flex flex-col h-screen bg-white">
			<div className="flex-grow overflow-auto p-8">
				<h2 className="text-2xl font-semibold mb-4">
					General Instructions:
				</h2>
				<ol className="list-decimal list-inside space-y-4 mb-6">
					<InstructionItem>
						The clock will be set at the server. The countdown timer
						at the top right corner of the screen will display the
						remaining time available for you to complete the
						examination. When the timer reaches zero, the
						examination will end by itself. You need not terminate
						the examination or submit your paper.
					</InstructionItem>

					<InstructionItem>
						The Question Palette displayed on the right side of the
						screen will show the status of each question using one
						of the following symbols:
						<div className="mt-2 ml-4">
							<StatusItem
								icon={<QuestionStatusIcon size={20} />}
								description="You have not visited the question yet."
							/>
							<StatusItem
								icon={
									<QuestionStatusIcon
										isVisited={true}
										size={20}
									/>
								}
								description="You have not answered the question."
							/>
							<StatusItem
								icon={
									<QuestionStatusIcon
										isAnswered={true}
										size={20}
									/>
								}
								description="You have answered the question."
							/>
							<StatusItem
								icon={
									<QuestionStatusIcon
										isMarked={true}
										size={20}
									/>
								}
								description="You have NOT answered the question, but have marked the question for review."
							/>
							<StatusItem
								icon={
									<QuestionStatusIcon
										isMarked={true}
										isAnswered={true}
										size={20}
									/>
								}
								description="You have answered the question, but marked it for review."
							/>
						</div>
						<p className="mt-2">
							The <strong>Mark For Review</strong> status for a
							question simply indicates that you would like to
							look at that question again. If a question is
							answered, but marked for review, then the answer
							will be considered for evaluation unless the status
							is modified by the candidate.
						</p>
					</InstructionItem>
				</ol>

				<h2 className="text-2xl font-semibold mb-4">
					Navigating to a Question:
				</h2>
				<ol className="list-decimal list-inside space-y-2 mb-6">
					<InstructionItem>
						To answer a question, do the following:
						<ol className="list-alpha list-inside ml-4 mt-2">
							<li>
								Click on the question number in the Question
								Palette at the right of your screen to go to
								that numbered question directly. Note that using
								this option does NOT save your answer to the
								current question.
							</li>
							<li>
								Click on <strong>Save &amp; Next</strong> to
								save your answer for the current question and
								then go to the next question.
							</li>
							<li>
								Click on{" "}
								<strong>Mark for Review &amp; Next</strong> to
								save your answer for the current question and
								also mark it for review, and then go to the next
								question.
							</li>
						</ol>
					</InstructionItem>
					<p className="mt-2">
						Note that your answer for the current question will not
						be saved, if you navigate to another question directly
						by clicking on a question number without saving the
						answer to the previous question.
					</p>
					<p className="mt-2">
						You can view all the questions by clicking on the{" "}
						<strong>Question Paper</strong> button. This feature is
						provided, so that if you want you can just see the
						entire question paper at a glance.
					</p>
				</ol>

				<h2 className="text-2xl font-semibold mb-4">
					Answering a Question:
				</h2>
				<ol className="list-decimal list-inside space-y-4">
					<InstructionItem>
						Procedure for answering a multiple choice (MCQ) type
						question:
						<ol className="list-alpha list-inside ml-4 mt-2">
							<li>
								Choose one answer from the 4 options (A,B,C,D)
								given below the question, click on the bubble
								placed before the chosen option.
							</li>
							<li>
								To deselect your chosen answer, click on the
								bubble of the chosen option again or click on
								the <strong>Clear Response</strong> button.
							</li>
							<li>
								To change your chosen answer, click on the
								bubble of another option.
							</li>
							<li>
								To save your answer, you MUST click on the{" "}
								<strong>Save &amp; Next</strong> button.
							</li>
						</ol>
					</InstructionItem>

					<InstructionItem>
						Procedure for answering a numerical answer type
						question:
						<ol className="list-alpha list-inside ml-4 mt-2">
							<li>
								To enter a number as your answer, use the
								virtual numerical keypad.
							</li>
							<li>
								A fraction (e.g. -0.3 or -.3) can be entered as
								an answer with or without &quot;0&quot; before
								the decimal point. As many as four decimal
								points, e.g. 12.5435 or 0.003 or -932.6711 or
								12.82 can be entered.
							</li>
							<li>
								To clear your answer, click on the{" "}
								<strong>Clear Response</strong> button.
							</li>
							<li>
								To save your answer, you MUST click on the{" "}
								<strong>Save &amp; Next</strong> button.
							</li>
						</ol>
					</InstructionItem>
				</ol>

				<h2 className="text-2xl font-semibold mb-4">
					Additional Instructions:
				</h2>
				<ol className="list-decimal list-inside space-y-2">
					<InstructionItem>
						To mark a question for review, click on the{" "}
						<strong>Mark for Review &amp; Next</strong> button. If
						an answer is selected (for MCQ/MCAQ) entered (for
						numerical answer type) for a question that is{" "}
						<strong>Marked for Review</strong>, that answer will be
						considered in the evaluation unless the status is
						modified by the candidate.
					</InstructionItem>
					<InstructionItem>
						To change your answer to a question that has already
						been answered, first select that question for answering
						and then follow the procedure for answering that type of
						question.
					</InstructionItem>
					<InstructionItem>
						Note that ONLY Questions for which answers are{" "}
						<strong>saved</strong> or{" "}
						<strong>marked for review after answering</strong> will
						be considered for evaluation.
					</InstructionItem>
					<InstructionItem>
						Sections in this question paper are displayed on the top
						bar of the screen. Questions in a Section can be viewed
						by clicking on the name of that Section. The Section you
						are currently viewing will be highlighted.
					</InstructionItem>
					<InstructionItem>
						After clicking the <strong>Save &amp; Next</strong>{" "}
						button for the last question in a Section, you will
						automatically be taken to the first question of the next
						Section in sequence.
					</InstructionItem>
					<InstructionItem>
						You can move the mouse cursor over the name of a Section
						to view the answering status for that Section.
					</InstructionItem>
				</ol>
			</div>

			<div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center">
				<button
					onClick={handlePreviousToTerms}
					className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
				>
					Go Back
				</button>
				<button
					onClick={handleAcceptTerms}
					className="px-4 py-2 bg-[#92c4f2] text-black rounded hover:bg-blue-600"
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default TermsAndConditions;
