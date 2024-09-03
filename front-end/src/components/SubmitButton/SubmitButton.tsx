import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";

export default function SubmitButton({
	disabled,
	className,
	children,
	...otherProps
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...otherProps}
			type="submit"
			disabled={disabled}
			className={classNames(
				"leading-10 px-5 rounded-full",
				{
					"bg-slate-200 text-slate-400": disabled,
					"bg-sky-700 text-white cursor-pointer": !disabled,
				},
				className
			)}
		>
			{children}
		</button>
	);
}
