import { ChangeEvent, useRef, useState } from "react";
import classNames from "classnames";
import { TextFieldProps } from "./TextField.types";
import { toTitleCase } from "../../utils/strings";
import eyeIcon from "../../images/eye.svg";
import eyeShutIcon from "../../images/eye-shut.svg";
import { validateInput } from "./functions";

export default function TextField({
	required,
	type,
	value,
	name,
	prettyName,
	placeholder,
	maxLength,
	disabled,
	validate = true,
	className,
	outerClassName,
	onChange,
	onValidated,
	onError,
}: TextFieldProps) {
	const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [isActive, setIsActive] = useState(false);
	const [passwordReadable, setPasswordReadable] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (name && !prettyName) {
		prettyName = toTitleCase(name);
	}

	const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		const trimmedValue = event.target.value.trim();

		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);

			debounceTimerRef.current = null;
		}

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
			debounceTimerRef.current = setTimeout(() => {
				debounceTimerRef.current = null;

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
		if (passwordReadable || !["password", "search"].includes(type)) {
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
					className={classNames("leading-10 outline-none px-2 flex-grow disabled:text-slate-400", className)}
					onFocus={() => setIsActive(true)}
					onBlur={() => setIsActive(false)}
				/>
				{type === "password" && (
					<button type="button" className="px-2" onClick={() => setPasswordReadable(!passwordReadable)}>
						<img src={passwordReadable ? eyeShutIcon : eyeIcon} className="w-6 h-auto" />
					</button>
				)}
			</div>
			{error && <p className="text-red-700 text-sm mt-2">{error}</p>}
		</div>
	);
}
