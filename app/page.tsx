"use client";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { Button } from "@nextui-org/react";
import { title, subtitle } from "@/components/primitives";
import useAuthStore from "@/lib/zustand";

export default function Home() {
	const { user, loading } = useAuthStore();

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center">
				<h2 className={title({ color: "pink" })}>Free&nbsp;</h2>
				<h1 className={title()}>SSC&nbsp;</h1>
				<h1 className={title()}>Mock&nbsp;</h1>
				<br />
				<h1 className={title()}>Tests</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
					Ace your SSC exams with our comprehensive Mock platform!
				</h2>
			</div>

			<div className="flex gap-3">
				{user ? (
					<>
						<Link href={`/ssc`}>
							<Button
								size="md"
								variant="shadow"
								color="primary"
								className="transition-all duration-300 ease-in-out transform group-hover:scale-110 bg-gradient-to-br from-blue-600 to-blue-900 text-white font-semibold px-4 py-2 rounded-full hover:from-blue-700 hover:to-purple-600"
							>
								All Mocks
							</Button>
						</Link>
						<Link
							className={buttonStyles({
								variant: "bordered",
								radius: "full",
							})}
							href="/upload"
						>
							Upload Questions
						</Link>
					</>
				) : (
					<Link href={`/login`}>
						<Button
							size="md"
							variant="shadow"
							color="primary"
							className="transition-all duration-300 ease-in-out transform group-hover:scale-110 bg-gradient-to-br from-blue-600 to-blue-900 text-white font-semibold px-4 py-2 rounded-full hover:from-blue-700 hover:to-purple-600"
						>
							Log In
						</Button>
					</Link>
				)}
			</div>
		</section>
	);
}
