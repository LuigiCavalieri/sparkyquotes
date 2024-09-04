import classNames from "classnames";
import { TextButtonProps } from "./TextButton.types";

export default function TextButton({
	testid,
	colorClassName,
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
				"hover:underline disabled:no-underline",
				{
					"text-sky-600 disabled:text-slate-500": !colorClassName,
				},
				colorClassName,
				className
			)}
		>
			{children}
		</button>
	);
}
