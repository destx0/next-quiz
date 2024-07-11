import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center">
				<h1 className={title()}>SSC&nbsp;</h1>
				<h1 className={title({ color: "violet" })}>
					Preparation&nbsp;
				</h1>
				<br />
				<h1 className={title()}>Quiz</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
					Ace your SSC exams with our comprehensive quiz platform!
				</h2>
			</div>

			<div className="flex gap-3">
				<Link
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
					})}
					href="/ssc"
				>
					Start Quiz
				</Link>
				<Link
					className={buttonStyles({
						variant: "bordered",
						radius: "full",
					})}
					href="/login"
				>
					Login
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
			</div>

			<div className="mt-8">
				<Snippet hideCopyButton hideSymbol variant="bordered">
					<span>
						Get started by taking a{" "}
						<Code color="primary">sample quiz</Code>
					</span>
				</Snippet>
			</div>
		</section>
	);
}
