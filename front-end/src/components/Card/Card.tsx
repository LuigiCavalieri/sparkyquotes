import { CardProps } from "./Card.types";

export default function Card({ title, children }: CardProps) {
	return (
		<section className="bg-white border-y border-slate-400 p-5 md:border-x md:rounded-md">
			{title && (
				<h2 className="text-center text-2xl font-semibold mt-2 mb-4 sm:text-left">{title}</h2>
			)}
			{children}
		</section>
	);
}
