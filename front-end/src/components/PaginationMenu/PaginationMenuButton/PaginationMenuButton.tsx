import classNames from "classnames";

export default function PaginationMenuButton({
	testid,
	className,
	children,
	...otherProps
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { testid?: string }) {
	return (
		<button
			{...otherProps}
			type="button"
			data-testid={testid}
			className={classNames(
				"text-sky-500 bg-sky-200 h-10 w-10 rounded-full flex justify-center items-center",
				"disabled:text-slate-400 disabled:bg-slate-200",
				className
			)}
		>
			{children}
		</button>
	);
}
