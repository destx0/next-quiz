import React from "react";

const Background = () => {
	return (
		<div className="fixed inset-0 z-0 pointer-events-none">
			{/* <div className="absolute inset-0 bg-black opacity-30"></div> */}
			<div className="absolute inset-0 backdrop-blur-sm"></div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMid slice"
				viewBox="0 0 1440 560"
				className="opacity-70"
			>
				<defs>
					<mask id="SvgjsMask1975">
						<rect width="1440" height="560" fill="#ffffff"></rect>
					</mask>
					<linearGradient
						x1="84.72%"
						y1="-39.29%"
						x2="15.28%"
						y2="139.29%"
						gradientUnits="userSpaceOnUse"
						id="SvgjsLinearGradient1976"
					>
						<stop stopColor="rgba(14, 42, 71, 0)" offset="0"></stop>
						<stop
							stopColor="rgba(243, 74, 225, 0.114)"
							offset="0.19"
						></stop>
						<stop
							stopColor="rgba(5, 255, 128, 0)"
							offset="0.57"
						></stop>
						<stop
							stopColor="rgba(5, 255, 128, 0.05)"
							offset="0.83"
						></stop>
						<stop stopColor="rgba(0, 69, 158, 0)" offset="1"></stop>
					</linearGradient>
				</defs>
				<g mask="url(#SvgjsMask1975)" fill="none">
					<rect
						width="1440"
						height="560"
						x="0"
						y="0"
						fill="url(#SvgjsLinearGradient1976)"
					></rect>
					<path
						d="M571.502,496.209C613.424,494.578,642.664,459.433,663.197,422.847C683.173,387.254,695.103,345.624,676.366,309.363C656.22,270.376,615.386,245.368,571.502,245.397C527.665,245.426,488.501,271.37,466.88,309.504C445.559,347.108,445.421,392.788,466.553,430.499C488.178,469.091,527.297,497.929,571.502,496.209"
						fill="rgba(183, 0, 255, 0.14)"
						className="triangle-float1"
					></path>
					<path
						d="M1354.877,318.54C1370.895,318.529,1380.809,302.857,1388.374,288.738C1395.395,275.635,1400.67,260.123,1393.004,247.386C1385.502,234.921,1369.425,232.975,1354.877,233.083C1340.579,233.189,1325.101,235.7,1317.719,247.945C1310.158,260.488,1314.478,275.824,1321.3,288.784C1328.766,302.967,1338.849,318.551,1354.877,318.54"
						fill="rgba(183, 0, 255, 0.14)"
						className="triangle-float1"
					></path>
					<path
						d="M896.841,323.857C918.933,322.879,935.001,305.875,946.61,287.053C959.039,266.902,969.897,243.402,959.622,222.072C948.217,198.394,923.12,183.367,896.841,183.731C871.12,184.088,849.171,201.109,837.004,223.772C825.5,245.2,826.328,270.949,838.808,291.824C850.96,312.15,873.182,324.904,896.841,323.857"
						fill="rgba(183, 0, 255, 0.14)"
						className="triangle-float2"
					></path>
					<path
						d="M333.642,536.315C348.887,536.059,363.695,528.875,370.849,515.411C377.641,502.629,372.715,488.061,366.13,475.172C358.651,460.533,350.079,442.842,333.642,442.586C316.998,442.327,307.171,459.437,299.352,474.132C292.156,487.655,286.81,503.283,294.207,516.697C301.806,530.477,317.908,536.579,333.642,536.315"
						fill="rgba(183, 0, 255, 0.14)"
						className="triangle-float2"
					></path>
					<path
						d="M993.468,606.029C1037.635,604.673,1078.662,585.826,1103.292,549.139C1131.425,507.234,1149.463,453.93,1125.342,409.594C1100.438,363.82,1045.416,343.168,993.468,347.275C947.681,350.895,916.536,388.28,893.358,427.933C869.883,468.093,848.516,515.709,871.31,556.26C894.402,597.341,946.364,607.475,993.468,606.029"
						fill="rgba(183, 0, 255, 0.14)"
						className="triangle-float2"
					></path>
					<path
						d="M569.579,318.267C590.815,318.036,612.553,309.964,622.503,291.202C631.991,273.311,624.178,252.499,613.618,235.22C603.625,218.87,588.708,205.735,569.579,204.605C548.357,203.351,526.779,211.404,515.497,229.422C503.56,248.486,502.927,273.162,514.622,292.375C525.907,310.914,547.876,318.503,569.579,318.267"
						fill="rgba(183, 0, 255, 0.14)"
						className="triangle-float1"
					></path>
				</g>
				<style>
					{`
            @keyframes float1 {
              0%{transform: translate(0, 0)}
              50%{transform: translate(-10px, 0)}
              100%{transform: translate(0, 0)}
            }

            .triangle-float1 {
              animation: float1 5s infinite;
            }

            @keyframes float2 {
              0%{transform: translate(0, 0)}
              50%{transform: translate(-5px, -5px)}
              100%{transform: translate(0, 0)}
            }

            .triangle-float2 {
              animation: float2 4s infinite;
            }

            @keyframes float3 {
              0%{transform: translate(0, 0)}
              50%{transform: translate(0, -10px)}
              100%{transform: translate(0, 0)}
            }

            .triangle-float3 {
              animation: float3 6s infinite;
            }
          `}
				</style>
			</svg>
		</div>
	);
};

export default Background;
