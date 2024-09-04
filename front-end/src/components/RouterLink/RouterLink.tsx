import classNames from "classnames";
import { Link, LinkProps } from "react-router-dom";

export default function RouterLink({ className, ...otherProps }: LinkProps) {
	return <Link {...otherProps} className={classNames("text-sky-600 underline", className)} />;
}
