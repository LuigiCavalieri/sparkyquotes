import { ArrowProps } from "./Arrow.types";

export default function Arrow({ direction, className, style }: ArrowProps) {
	return (
		<span className="flex items-center justify-center">
			<svg
				className={className}
				style={style}
				width="24"
				height="24"
				aria-hidden="true"
				role="img"
				focusable="false"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				{direction === "left" ? (
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M20 13v-2H8l4-4-1-2-7 7 7 7 1-2-4-4z"
						fill="currentColor"
					/>
				) : (
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="m4 13v-2h12l-4-4 1-2 7 7-7 7-1-2 4-4z"
						fill="currentColor"
					/>
				)}
			</svg>
		</span>
	);
}
