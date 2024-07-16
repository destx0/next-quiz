import React from "react";
import { Card } from "@nextui-org/react";
import { title } from "@/components/primitives";
import { motion } from "framer-motion";

const getRandomColor = () => {
	const hue = Math.floor(Math.random() * 360);
	return `hsl(${hue}, 90%, 85%)`;
};

const testimonials = [
	{
		quote: "These mock tests were crucial in my SSC CGL preparation. The questions were very similar to the actual exam!",
		author: "Rahul S., SSC CGL 2023 Qualifier",
	},
	{
		quote: "The detailed analytics helped me focus on my weak areas. I improved my score by 20% in just two months!",
		author: "Priya M., SSC CHSL 2023 Topper",
	},
];

export default function Testimonials() {
	return (
		<section>
			<h2 className={title({ size: "sm", class: "text-center mb-8" })}>
				Success Stories
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{testimonials.map((testimonial, index) => {
					const backgroundColor = getRandomColor();
					return (
						<motion.div
							key={index}
							initial={{
								opacity: 0,
								x: index % 2 === 0 ? -20 : 20,
							}}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<Card className="h-full overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
								<div
									className="absolute inset-0 bg-opacity-80 transition-all duration-300 ease-in-out group-hover:bg-opacity-100"
									style={{
										backgroundColor,
										backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
										backgroundBlendMode: "overlay",
									}}
								></div>
								<Card className="relative z-10 p-6 bg-transparent">
									<p className="italic text-gray-700 dark:text-gray-300 mb-4">
										{testimonial.quote}
									</p>
									<p className="font-semibold text-gray-800 dark:text-white">
										- {testimonial.author}
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
