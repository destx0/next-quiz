import React from "react";
import { Button } from "@nextui-org/react";
import { title, subtitle } from "@/components/primitives";
import useAuthStore from "@/lib/zustand";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
	const { user } = useAuthStore((state) => ({ user: state.user }));

	return (
		<section className="flex flex-col md:flex-row items-center justify-between mb-16">
			<div className="md:w-1/2 mb-8 md:mb-0">
				<h1 className={title({ class: "mb-4" })}>
					Free SSC Mock Tests
				</h1>
				<p className={subtitle({ class: "mb-8" })}>
					Ace your SSC exams with our comprehensive Mock platform!
				</p>
				<Link href={user ? "/ssc" : "/login"}>
					<Button
						color="primary"
						size="lg"
						variant="shadow"
						className="font-semibold px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
					>
						{user ? "Start Mock Test" : "Sign Up Now"}
					</Button>
				</Link>
			</div>
			<div className="md:w-1/2">
				<Image
					src="/anish.jpg"
					alt="SSC Exam Preparation"
					width={500}
					height={300}
					className="rounded-lg shadow-lg"
				/>
			</div>
		</section>
	);
}
