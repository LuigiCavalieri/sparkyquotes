import { ChangeEvent, useState } from "react";
import classNames from "classnames";
import { TextFieldProps } from "./TextField.types";
import { toTitleCase } from "../../utils/strings";
import { validateInput } from "./functions";
import EyeSlashIcon from "../Heroicons/EyeSlash";
import EyeIcon from "../Heroicons/EyeIcon";
import { useTimer } from "../../hooks/timer";

export default function TextField({
	required,
	type,
	value,
	name,
	prettyName,
	placeholder,
	maxLength,
	disabled,
	validate,
	className,
	outerClassName,
	onChange,
	onValidated,
	onError,
}: TextFieldProps) {
	const { setTimer: setDebounceTimer, clearTimer: clearDebounceTimer } = useTimer();
	const [isActive, setIsActive] = useState(false);
	const [passwordReadable, setPasswordReadable] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (name && !prettyName) {
		prettyName = toTitleCase(name);
	}

	const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		const trimmedValue = event.target.value.trim();

		clearDebounceTimer();

		if (required && !trimmedValue) {
			triggerOnChange(event);
			triggerOnError(`${prettyName} cannot be empty.`, event);

			return;
		}

		triggerOnChange(event);

		if (!validate) {
			setError(null);

			return;
		}

		if (error || !["password", "email"].includes(type)) {
			const valueValid = triggerOnValidated(event);

			if (valueValid) {
				setError(null);
			}
		} else {
			setDebounceTimer(() => {
				triggerOnValidated(event);
			}, 300);
		}
	};

	const triggerOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (typeof onChange === "function") {
			onChange(event);
		}
	};

	const triggerOnValidated = (event: ChangeEvent<HTMLInputElement>): boolean => {
		const value = event.target.value;

		if (!value) {
			triggerOnError(`${prettyName} cannot be empty.`, event);

			return false;
		}

		const inputValid = validateInput(type, value, errorMsg => triggerOnError(errorMsg, event));

		if (inputValid && typeof onValidated === "function") {
			onValidated(value, event);
		}

		return inputValid;
	};

	const triggerOnError = (msg: string, event: ChangeEvent<HTMLInputElement>) => {
		setError(msg);

		if (typeof onError === "function") {
			onError(event);
		}
	};

	const getInputType = () => {
		if (passwordReadable || ["email"].includes(type)) {
			return "text";
		}

		return type;
	};

	return (
		<div className={outerClassName}>
			<div
				className={classNames("border rounded-sm flex", {
					"border-red-700": Boolean(error),
					"border-sky-500": isActive && !error,
					"border-slate-300": !isActive && !error,
				})}
			>
				<input
					data-testid={`text-field-${name}`}
					type={getInputType()}
					value={value}
					name={name}
					maxLength={maxLength}
					disabled={disabled}
					placeholder={placeholder}
					onChange={handleOnChange}
					className={classNames(
						"leading-10 outline-none px-2 flex-grow disabled:text-slate-400",
						className
					)}
					onFocus={() => setIsActive(true)}
					onBlur={() => setIsActive(false)}
				/>
				{type === "password" && (
					<button
						type="button"
						className="px-2"
						onClick={() => setPasswordReadable(!passwordReadable)}
					>
						{passwordReadable ? <EyeSlashIcon /> : <EyeIcon />}
					</button>
				)}
			</div>
			{error && <p className="text-red-700 text-sm mt-2">{error}</p>}
		</div>
	);
}
