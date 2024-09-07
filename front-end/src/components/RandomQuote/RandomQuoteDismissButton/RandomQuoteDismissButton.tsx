import classNames from "classnames";
import TextButton from "../../TextButton/TextButton";
import { TextButtonProps } from "../../TextButton/TextButton.types";

export default function RandomQuoteDismissButton({ className, ...otherProps }: TextButtonProps) {
	return (
		<TextButton
			{...otherProps}
			testid="random-quote-dismiss-button"
			className={classNames("text-sm sm:leading-7", className)}
		>
			Dismiss
		</TextButton>
	);
}
