import { ReactNode, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { pageItems } from "../config/pageItems";
import AuthLayout from "../components/AuthLayout/AuthLayout";
import { Navigate, useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";
import { activateAccount } from "../services/AuthService";
import { isEmail } from "../utils/strings";
import { ResponseError } from "../types/error";
import { ErrorCodes } from "../constants";
import RouterLink from "../components/RouterLink/RouterLink";

export default function ActivateAccountPage() {
	const [searchParams] = useSearchParams();
	const [errorMessage, setErrorMessage] = useState<ReactNode>(null);

	const email = searchParams.get("email") || "";
	const activationToken = searchParams.get("activationToken") || "";
	const searchParamsExist = email && activationToken;

	const { isLoading, mutate } = useMutation<Response, ResponseError>({
		mutationFn: () => activateAccount(email, activationToken),
		onError: error => {
			if (error.message === ErrorCodes.accountCannotBeActivated) {
				setErrorMessage(
					<>
						<strong>Your account cannot be activated.</strong> Maybe your activation link has
						expired.
						<br />
						<br />
						Please, <RouterLink to={pageItems.signup.url}>try to sign up anew</RouterLink>.
					</>
				);
			} else {
				setErrorMessage(
					<>
						<strong>Something didn't work</strong> as expected, please try again later.
					</>
				);
			}
		},
	});

	useEffect(() => {
		if (!searchParamsExist) {
			return;
		}

		if (!isEmail(email) || /[^a-z0-9-]$/i.test(activationToken)) {
			setErrorMessage(
				<>
					Your account cannot be activated.
					<br />
					Please check your activation link and retry.
				</>
			);

			return;
		}

		mutate();
	}, []);

	if (!searchParamsExist) {
		return <Navigate to={pageItems.signup.url} />;
	}

	return (
		<AuthLayout>
			<Helmet>
				<title>{pageItems.activateAccount.pageTitle}</title>
			</Helmet>
			<div className="text-lg text-center flex flex-grow justify-center items-center ">
				{errorMessage ? (
					<p>{errorMessage}</p>
				) : isLoading ? (
					<p>Your account is being activated...</p>
				) : (
					<p>
						Your account is active!
						<br />
						<RouterLink to={pageItems.login.url}>Log in</RouterLink>
					</p>
				)}
			</div>
		</AuthLayout>
	);
}
