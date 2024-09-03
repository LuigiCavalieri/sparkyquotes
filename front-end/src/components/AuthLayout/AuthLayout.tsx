import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../hooks/auth";
import { AuthLayoutProps } from "./AuthLayout.types";
import AuthForm from "../AuthForm/AuthForm";
import { AuthFormValues } from "../AuthForm/AuthForm.types";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import appConfig from "../../config/appConfig";
import { pageItems } from "../../config/pageItems";
import RouterLink from "../RouterLink/RouterLink";

export default function AuthLayout({ type, afterForm }: AuthLayoutProps) {
	const [formDisabled, setFormDisabled] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const { isLoggedIn, isQuering, isMutating, errorMessage, doLogin, doSignup } = useAuth();

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

	if (isQuering) {
		return <LoadingScreen />;
	}

	if (isLoggedIn) {
		return <Navigate to={pageItems.admin.url} />;
	}

	return (
		<div className="bg-sky-100 min-h-screen flex items-center">
			<Helmet>
				<title>
					{pageItems[type].pageTitle}
					{type === "signup" ? ` | ${appConfig.appName}` : ""}
				</title>
			</Helmet>
			<div className="bg-white shadow-xl px-10 py-5 w-full min-h-80 sm:w-96 sm:px-5 sm:rounded-lg sm:mx-auto">
				<h3 className="text-center text-3xl font-semibold mb-8 mt-2">
					{showSuccessMessage ? "Account Created" : pageItems[type].pageTitle}
				</h3>
				{showSuccessMessage ? (
					<p className="leading-8 text-lg text-center mt-16">
						Your account is ready.
						<br />
						Now you just need to{" "}
						<RouterLink to={pageItems.login.url} className="font-semibold">
							Log in!
						</RouterLink>
					</p>
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
			</div>
		</div>
	);
}
