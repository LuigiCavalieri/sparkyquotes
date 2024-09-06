import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../hooks/auth";
import { AuthPageProps } from "./AuthPage.types";
import AuthForm from "../AuthForm/AuthForm";
import { AuthFormValues } from "../AuthForm/AuthForm.types";
import appConfig from "../../config/appConfig";
import { pageItems } from "../../config/pageItems";
import AuthLayout from "../AuthLayout/AuthLayout";

export default function AuthPage({ type, afterForm }: AuthPageProps) {
	const [formDisabled, setFormDisabled] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const { isMutating, errorMessage, doLogin, doSignup } = useAuth();

	const handleOnSubmit = (formValues: AuthFormValues) => {
		const onError = () => setFormDisabled(false);

		setFormDisabled(true);

		if (type === "signup") {
			doSignup(formValues, {
				onError,
				onSuccess: () => setShowSuccessMessage(true),
			});
		} else {
			doLogin(formValues, { onError });
		}
	};

	return (
		<AuthLayout>
			<Helmet>
				<title>
					{pageItems[type].pageTitle}
					{type === "signup" ? ` | ${appConfig.appName}` : ""}
				</title>
			</Helmet>
			{!showSuccessMessage && (
				<h3 className="text-center text-3xl font-semibold mb-8 mt-2">
					{pageItems[type].pageTitle}
				</h3>
			)}
			{showSuccessMessage ? (
				<div className="flex-grow flex items-center">
					<p className="text-lg text-center">
						<strong>Your account is almost ready.</strong>
						<br />
						<br />
						Please, check your mailbox, you should have received an email with instructions on how
						to activate your account.
						<br />
						<br />
						Thank you!
					</p>
				</div>
			) : (
				<>
					<AuthForm
						type={type}
						errorMessage={errorMessage}
						isLoading={isMutating}
						disabled={formDisabled}
						onSubmit={handleOnSubmit}
					/>
					{afterForm}
				</>
			)}
		</AuthLayout>
	);
}
