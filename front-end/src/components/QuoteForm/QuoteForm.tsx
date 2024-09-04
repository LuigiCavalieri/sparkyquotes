import { ChangeEvent, useRef, useState, FormEvent } from "react";
import appConfig from "../../config/appConfig";
import { useSaveQuote } from "../../hooks/quotes";
import SubmitButton from "../SubmitButton/SubmitButton";
import TextField from "../TextField/TextField";
import Card from "../Card/Card";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { QuoteWithoutServerGenFields } from "../../types/quotes";

export default function QuoteForm() {
	const formRef = useRef<HTMLFormElement | null>(null);
	const [submitEnabled, setSubmitEnabled] = useState(false);

	const { isError, isLoading, mutate } = useSaveQuote({
		onSuccess: () => {
			if (formRef.current) {
				formRef.current.reset();
			}
		},
		onError: () => {
			setSubmitEnabled(true);
		},
	});

	const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!formRef.current) {
			return;
		}

		const formData = new FormData(formRef.current);
		const fieldsValue = Object.fromEntries(formData.entries()) as QuoteWithoutServerGenFields;

		setSubmitEnabled(false);
		mutate(fieldsValue);
	};

	const handleOnChangeTextarea = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.target.value.trim();

		setSubmitEnabled(Boolean(value));
	};

	return (
		<Card>
			{isError && (
				<ErrorMessage canBeDismissed className="mt-2">
					Save failed. Please try again.
				</ErrorMessage>
			)}
			<form
				data-testid="quote-form"
				className="grid gap-5 py-2"
				ref={formRef}
				onSubmit={handleOnSubmit}
			>
				<textarea
					required
					className="leading-6 outline-none p-2 border rounded-sm border-slate-300 h-40 resize-none disabled:text-slate-400 focus:border-sky-500"
					name="content"
					disabled={isLoading}
					placeholder="Type in the quote you want to save"
					onChange={handleOnChangeTextarea}
				/>
				<TextField
					type="text"
					name="author"
					placeholder="by 'anonymous'"
					validate={false}
					disabled={isLoading}
					maxLength={appConfig.authorNameMaxLength}
				/>
				<SubmitButton disabled={!submitEnabled || isLoading} className="justify-self-end w-1/4">
					{isLoading ? "Saving..." : "Save"}
				</SubmitButton>
			</form>
		</Card>
	);
}
