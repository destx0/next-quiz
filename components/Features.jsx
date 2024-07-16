import React from "react";
import { Card } from "@nextui-org/react";
import { BookOpen, CheckCircle, BarChart } from "lucide-react";
import { title } from "@/components/primitives";
import { motion } from "framer-motion";

const getRandomColor = () => {
	const hue = Math.floor(Math.random() * 360);
	return `hsl(${hue}, 90%, 85%)`;
};

const features = [
	{
		icon: BookOpen,
		title: "SSC-Focused Content",
		desc: "Our questions are tailored specifically for SSC exams, covering all relevant subjects and topics.",
	},
	{
		icon: CheckCircle,
		title: "Exam-like Experience",
		desc: "Simulate real SSC exam conditions with our timed, full-length mock tests that mimic the actual exam pattern.",
	},
	{
		icon: BarChart,
		title: "Detailed Analytics",
		desc: "Get comprehensive performance reports to identify your strengths and areas for improvement in SSC exam preparation.",
	},
];

export default function Features() {
	return (
		<section className="mb-16">
			<h2
				className={title({
					size: "sm",
					class: "text-center mb-16", // Increased bottom margin
				})}
			>
				Why Choose Our Platform?
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
				{" "}
				{/* Added top margin */}
				{features.map((feature, index) => {
					const backgroundColor = getRandomColor();
					return (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<Card className="h-full overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
								<div
									className="absolute inset-0 bg-opacity-90 transition-all duration-300 ease-in-out group-hover:bg-opacity-100"
									style={{
										backgroundColor,
										backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
										backgroundBlendMode: "overlay",
									}}
								></div>
								<Card className="relative z-10 p-6 bg-transparent">
									<feature.icon
										size={32}
										className="text-gray-800 dark:text-white mb-4"
									/>
									<h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
										{feature.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-300">
										{feature.desc}
									</p>
								</Card>
							</Card>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}
