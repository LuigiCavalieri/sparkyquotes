import { ChangeEvent, useRef, useState, FormEvent, useEffect } from "react";
import appConfig from "../../config/appConfig";
import { useSaveQuote } from "../../hooks/quotes";
import SubmitButton from "../SubmitButton/SubmitButton";
import TextField from "../TextField/TextField";
import Card from "../Card/Card";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { QuoteWithoutServerGenFields } from "../../types/quotes";

export default function QuoteForm() {
	const formRef = useRef<HTMLFormElement | null>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [submitEnabled, setSubmitEnabled] = useState(false);
	const [showSaved, setShowSaved] = useState(false);

	const { isError, isLoading, error, mutate } = useSaveQuote({
		onSuccess: () => {
			if (formRef.current) {
				formRef.current.reset();
				showFeedback();
			}
		},
		onError: () => {
			setSubmitEnabled(true);
		},
	});

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, []);

	const showFeedback = () => {
		setShowSaved(true);

		timerRef.current = setTimeout(() => {
			timerRef.current = null;

			setShowSaved(false);
		}, appConfig.feedbackTimeout);
	};

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
					{error.message}
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
					type="name"
					name="author"
					placeholder="by 'anonymous'"
					disabled={isLoading}
					maxLength={appConfig.authorNameMaxLength}
				/>
				<div className="flex items-center justify-end gap-2">
					{showSaved && <span className="font-medium text-green-700 text-sm">Saved!</span>}
					<SubmitButton disabled={!submitEnabled || isLoading} className="w-1/4">
						{isLoading ? "Saving..." : "Save"}
					</SubmitButton>
				</div>
			</form>
		</Card>
	);
}
