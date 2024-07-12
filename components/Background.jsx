import React from "react";

const Background = () => {
	return (
		<div className="fixed inset-0 z-0 pointer-events-none">
			<div className="absolute inset-0 bg-black opacity-30"></div>
			<div className="absolute inset-0 backdrop-blur-sm"></div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMid slice"
				viewBox="0 0 1440 720"
				className="opacity-70"
			>
				<g mask="url(#SvgjsMask2265)" fill="none">
					<rect
						width="1440"
						height="720"
						x="0"
						y="0"
						fill="url(#SvgjsLinearGradient2266)"
					></rect>
					<path
						d="M290.35 747.85C476.11 738.15 587.93 423.02 952.44 408.39 1316.95 393.76 1435.51 140.11 1614.53 134.79"
						stroke="rgba(1, 139, 193, 0.58)"
						strokeWidth="2"
					></path>
					<path
						d="M644.7 808.82C749.97 780.81 674.79 517.35 942.16 490.42 1209.53 463.49 1372.77 216.56 1537.09 209.62"
						stroke="rgba(1, 139, 193, 0.58)"
						strokeWidth="2"
					></path>
					<path
						d="M276.48 766.88C396.7 754.09 470.48 494.07 674.95 492.88 879.42 491.69 874.18 582.88 1073.42 582.88 1272.65 582.88 1369.76 493.44 1471.89 492.88"
						stroke="rgba(1, 139, 193, 0.58)"
						strokeWidth="2"
					></path>
					<path
						d="M505.54 849.89C640.85 771.02 569.57 311.13 817.18 306.44 1064.79 301.75 1275.58 519.41 1440.46 522.44"
						stroke="rgba(1, 139, 193, 0.58)"
						strokeWidth="2"
					></path>
					<path
						d="M770.49 769.05C907.57 732.16 904.3 398.22 1156.83 352.93 1409.35 307.64 1427.44 105.37 1543.16 93.73"
						stroke="rgba(1, 139, 193, 0.58)"
						strokeWidth="2"
					></path>
				</g>
				<defs>
					<mask id="SvgjsMask2265">
						<rect width="1440" height="720" fill="#ffffff"></rect>
					</mask>
					<linearGradient
						x1="87.5%"
						y1="-25%"
						x2="12.5%"
						y2="125%"
						gradientUnits="userSpaceOnUse"
						id="SvgjsLinearGradient2266"
					>
						<stop stopColor="rgba(66, 14, 71, 1)" offset="0"></stop>
						<stop stopColor="rgba(0, 0, 0, 1)" offset="0.56"></stop>
					</linearGradient>
				</defs>
			</svg>
		</div>
	);
};

export default Background;
