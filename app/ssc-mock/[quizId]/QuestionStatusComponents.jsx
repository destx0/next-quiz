import React from "react";

export const QuestionStatusIcon = ({
	isActive,
	isAnswered,
	isVisited,
	isMarked,
	number,
	size = 40,
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
					fontSize={size * 2}
					fontWeight="bold"
				>
					{number}
				</text>
			)}
		</svg>
	);
};

const LegendItem = ({ icon, label }) => (
	<div className="flex items-center mr-4 mb-2">
		{icon}
		<span className="ml-1 text-xs">{label}</span>
	</div>
);

export const Legend = () => (
	<div className="p-2">
		<div className="flex flex-wrap">
			<LegendItem
				icon={<QuestionStatusIcon isAnswered={true} size={20} />}
				label="Answered"
			/>
			<LegendItem
				icon={<QuestionStatusIcon isMarked={true} size={20} />}
				label="Marked"
			/>
			<LegendItem
				icon={<QuestionStatusIcon size={20} />}
				label="Not Visited"
			/>
		</div>
		<div className="flex flex-wrap">
			<LegendItem
				icon={
					<QuestionStatusIcon
						isMarked={true}
						isAnswered={true}
						size={20}
					/>
				}
				label="Marked & Answered"
			/>
			<LegendItem
				icon={<QuestionStatusIcon isVisited={true} size={20} />}
				label="Not Answered"
			/>
		</div>
	</div>
);
