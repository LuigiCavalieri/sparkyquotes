import { CardProps } from "./Card.types";

export default function Card({ testid, title, children }: CardProps) {
	return (
		<section
			data-testid={testid}
			className="bg-white border-y border-slate-400 p-3 sm:p-5 md:border-x md:rounded-md"
		>
			{title && (
				<h2 className="text-center text-xl font-semibold my-2 sm:mb-4 sm:text-2xl sm:text-left">
					{title}
				</h2>
			)}
			{children}
		</section>
	);
}
