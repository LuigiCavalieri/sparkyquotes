import { ChangeEvent, useState, FormEvent, useCallback } from "react";
import appConfig from "../../config/appConfig";
import { useSaveQuote } from "../../hooks/quotes";
import SubmitButton from "../SubmitButton/SubmitButton";
import TextField from "../TextField/TextField";
import Card from "../Card/Card";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { QuoteWithoutServerGenFields } from "../../types/quotes";
import { useTimer } from "../../hooks/timer";

export default function QuoteForm() {
	const { setTimer, clearTimer } = useTimer();
	const [submitEnabled, setSubmitEnabled] = useState(false);
	const [showOptimisticSaved, setShowOptimisticSaved] = useState(false);
	const [formValues, setFormValues] = useState(initFormValues);

	const { isError, error, mutate } = useSaveQuote({
		onError: (_error, variables) => {
			clearTimer();
			setShowOptimisticSaved(false);
			setFormValues(variables);
			setSubmitEnabled(true);
		},
	});

	const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setFormValues(initFormValues);
		setSubmitEnabled(false);
		setShowOptimisticSaved(true);
		mutate(formValues);

		setTimer(() => {
			setShowOptimisticSaved(false);
		}, appConfig.feedbackTimeout);
	};

	const handleOnChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
			const value = event.target.value;

			setFormValues({
				...formValues,
				[event.target.name]: value,
			});

			if (event.target.tagName === "TEXTAREA") {
				setSubmitEnabled(Boolean(value.trim()));
			}
		},
		[formValues]
	);

	return (
		<Card>
			{isError && (
				<ErrorMessage canBeDismissed className="mt-2">
					{error.message}
				</ErrorMessage>
			)}
			<form data-testid="quote-form" className="grid gap-5 py-2" onSubmit={handleOnSubmit}>
				<textarea
					required
					className="leading-6 outline-none p-2 border rounded-sm border-slate-300 h-40 resize-none disabled:text-slate-400 focus:border-sky-500"
					name="content"
					placeholder="Type in the quote you want to save"
					value={formValues.content}
					onChange={handleOnChange}
				/>
				<TextField
					type="name"
					name="author"
					placeholder="by 'anonymous'"
					maxLength={appConfig.authorNameMaxLength}
					value={formValues.author!}
					onChange={handleOnChange}
				/>
				<div className="flex items-center justify-end gap-2">
					{showOptimisticSaved && (
						<span className="font-medium text-green-700 text-sm">Saved!</span>
					)}
					<SubmitButton disabled={!submitEnabled} className="w-1/4">
						Save
					</SubmitButton>
				</div>
			</form>
		</Card>
	);
}

const initFormValues: QuoteWithoutServerGenFields = { content: "", author: "" };
