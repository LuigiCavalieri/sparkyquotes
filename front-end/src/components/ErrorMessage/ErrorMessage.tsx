import { useState } from "react";
import { ErrorMessageProps } from "./ErrorMessage.types";
import classNames from "classnames";

export default function ErrorMessage({
	testid,
	canBeDismissed,
	className,
	children,
}: ErrorMessageProps) {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) {
		return null;
	}

	return (
		<div
			className={classNames(
				"bg-red-100 text-red-700 px-4 border-l-2 border-red-700 mb-8 flex justify-between items-center",
				className
			)}
		>
			<div className="leading-8 text-sm" data-testid={testid}>
				{children}
			</div>
			{canBeDismissed && (
				<button
					title="Dismiss"
					className="bg-red-300 text-white rounded-full leading-none h-5 w-5 pb-0.5 hover:bg-red-500"
					onClick={() => setDismissed(true)}
				>
					x
				</button>
			)}
		</div>
	);
}
