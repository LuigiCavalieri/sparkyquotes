import classNames from "classnames";
import { TextButtonProps } from "./TextButton.types";

export default function TextButton({
	testid,
	className,
	children,
	...otherProps
}: TextButtonProps) {
	return (
		<button
			{...otherProps}
			type="button"
			data-testid={testid}
			className={classNames(
				"text-sky-500 hover:underline disabled:text-slate-500 disabled:no-underline",
				className
			)}
		>
			{children}
		</button>
	);
}
