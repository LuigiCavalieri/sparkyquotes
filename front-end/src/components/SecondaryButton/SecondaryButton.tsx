import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";

export default function SecondaryButton({
	disabled,
	className,
	children,
	...otherProps
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...otherProps}
			type="button"
			disabled={disabled}
			className={classNames(
				"border-2 rounded-lg px-3 leading-8",
				{
					"border-slate-300 text-slate-400": disabled,
					"border-sky-700 text-sky-700": !disabled,
				},
				className
			)}
		>
			{children}
		</button>
	);
}
