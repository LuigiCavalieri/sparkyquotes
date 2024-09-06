import { ChangeEvent } from "react";

export type TextFieldInputTypes = "name" | "email" | "password" | "search";

export interface TextFieldProps {
	required?: boolean;
	type: TextFieldInputTypes;
	value?: string;
	placeholder?: string;
	name?: string;
	prettyName?: string;
	maxLength?: number;
	disabled?: boolean;
	validate?: boolean;
	className?: string;
	outerClassName?: string;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	onValidated?: (validatedValue: string, event: ChangeEvent<HTMLInputElement>) => void;
	onError?: (event: ChangeEvent<HTMLInputElement>) => void;
}
