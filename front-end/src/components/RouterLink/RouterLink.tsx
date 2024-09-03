import classNames from "classnames";
import { Link, LinkProps } from "react-router-dom";

export default function RouterLink({ colorClass, className, ...otherProps }: LinkProps & { colorClass?: string }) {
	return <Link className={classNames(className, colorClass || "text-sky-700")} {...otherProps} />;
}
