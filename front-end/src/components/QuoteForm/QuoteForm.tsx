import { ChangeEvent, useState } from "react";
import appConfig from "../../config/appConfig";
import useQuotes from "../../hooks/quotes";
import * as Quotes from "../../types/quotes";
import SubmitButton from "../SubmitButton/SubmitButton";
import TextField from "../TextField/TextField";
import Card from "../Card/Card";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function QuoteForm() {
	const [submitEnabled, setSubmitEnabled] = useState(false);

	const { saveMutationState, saveQuote } = useQuotes();

	const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formElement = event.target as HTMLFormElement;
		const formData = new FormData(formElement);
		const fieldsValue = Object.fromEntries(formData.entries()) as Quotes.ItemWithoutServerGenFields;

		setSubmitEnabled(false);
		saveQuote(fieldsValue, {
			onSuccess: () => {
				formElement.reset();
			},
			onError: () => {
				setSubmitEnabled(true);
			},
		});
	};

	const handleOnChangeTextarea = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.target.value.trim();

		setSubmitEnabled(Boolean(value));
	};

	return (
		<Card>
			{saveMutationState.isError && (
				<ErrorMessage canBeDismissed className="mt-2">
					Save failed. Please try again.
				</ErrorMessage>
			)}
			<form data-testid="quote-form" className="grid gap-5 py-2" onSubmit={handleOnSubmit}>
				<textarea
					required
					className="leading-6 outline-none p-2 border rounded-sm border-slate-300 h-40 resize-none disabled:text-slate-400 focus:border-sky-500"
					name="content"
					disabled={saveMutationState.isLoading}
					placeholder="Type in the quote you want to save"
					onChange={handleOnChangeTextarea}
				/>
				<TextField
					type="text"
					name="author"
					placeholder="by 'anonymous'"
					validate={false}
					disabled={saveMutationState.isLoading}
					maxLength={appConfig.authorNameMaxLength}
				/>
				<SubmitButton
					disabled={!submitEnabled || saveMutationState.isLoading}
					className="justify-self-end w-1/4"
				>
					{saveMutationState.isLoading ? "Saving..." : "Save"}
				</SubmitButton>
			</form>
		</Card>
	);
}
