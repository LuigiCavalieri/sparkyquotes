import AuthPage from "../components/AuthPage/AuthPage";
import RouterLink from "../components/RouterLink/RouterLink";
import { pageItems } from "../config/pageItems";

export default function SignupPage() {
	return (
		<AuthPage
			type="signup"
			afterForm={
				<p>
					Do you already have an account? <RouterLink to={pageItems.login.url}>Log in</RouterLink>
				</p>
			}
		/>
	);
}
