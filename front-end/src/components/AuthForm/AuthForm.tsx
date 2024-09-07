import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { AuthFormFieldsInfo, AuthFormProps, AuthFormValues } from "./AuthForm.types";
import TextField from "../TextField/TextField";
import SubmitButton from "../SubmitButton/SubmitButton";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function AuthForm({
	type,
	errorMessage,
	disabled,
	isLoading,
	onSubmit,
}: AuthFormProps) {
	const isSignupForm = type === "signup";
	const initialFieldsInfo = getFieldsInfo(isSignupForm);

	const [submitEnabled, setSubmitEnabled] = useState(false);
	const [fieldsInfo, setFieldsInfo] = useState(initialFieldsInfo);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const handleOnChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const key = event.target.name;
			const newInfo = { ...fieldsInfo };

			newInfo[key].value = event.target.value;

			setFieldsInfo(newInfo);
			setErrorMsg(null);
		},
		[fieldsInfo]
	);

	const updateIsValidInfo = useCallback(
		(flag: boolean, event: ChangeEvent<HTMLInputElement>) => {
			const key = event.target.name;
			const newInfo = { ...fieldsInfo };

			newInfo[key].isValid = flag;

			setFieldsInfo(newInfo);
		},
		[fieldsInfo]
	);

	const handleOnValidated = useCallback(
		(_validValue: string, event: ChangeEvent<HTMLInputElement>) => {
			updateIsValidInfo(true, event);
		},
		[updateIsValidInfo]
	);

	const handleOnError = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			updateIsValidInfo(false, event);
		},
		[updateIsValidInfo]
	);

	useEffect(() => {
		let allValid = true;

		for (const key in fieldsInfo) {
			if (
				(typeof fieldsInfo[key].value === "string" && !fieldsInfo[key].value) ||
				(fieldsInfo[key].canBeValidated && !fieldsInfo[key].isValid)
			) {
				allValid = false;

				break;
			}
		}

		setSubmitEnabled(allValid);
	}, [fieldsInfo]);

	useEffect(() => {
		setErrorMsg(errorMessage);
	}, [errorMessage]);

	const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMsg(null);

		const formValues = {} as AuthFormValues;

		for (const key in fieldsInfo) {
			const _key = String(key) as keyof AuthFormValues;

			formValues[_key] = fieldsInfo[_key].value;
		}

		if (typeof onSubmit === "function") {
			onSubmit(formValues);
		}
	};

	return (
		<>
			<form
				data-testid={`${type}-form`}
				className="flex flex-col gap-5 mb-10"
				onSubmit={handleOnSubmit}
			>
				{Object.values(fieldsInfo).map(info => {
					return (
						<TextField
							required
							key={`Field_${info.name}`}
							type={info.type}
							name={info.name}
							placeholder={info.shortDescription}
							value={String(info.value)}
							disabled={disabled}
							validate={info.canBeValidated}
							onChange={handleOnChange}
							onValidated={handleOnValidated}
							onError={handleOnError}
						/>
					);
				})}
				<SubmitButton disabled={!submitEnabled || disabled} className="mt-2">
					{isLoading ? "Please wait..." : isSignupForm ? "Sign up" : "Log in"}
				</SubmitButton>
			</form>
			{errorMsg && <ErrorMessage testid={`${type}-error-message`}>{errorMsg}</ErrorMessage>}
		</>
	);
}

const getFieldsInfo = (isSignupForm: boolean) => {
	const info: AuthFormFieldsInfo = {};

	if (isSignupForm) {
		info.name = {
			value: "",
			canBeValidated: true,
			type: "name",
			name: "name",
			shortDescription: "Your Name",
		};
	}

	info.email = {
		value: "",
		canBeValidated: true,
		type: "email",
		name: "email",
		shortDescription: "Your Email",
	};
	info.password = {
		value: "",
		canBeValidated: isSignupForm,
		type: "password",
		name: "password",
		shortDescription: "Password",
	};

	return info;
};
