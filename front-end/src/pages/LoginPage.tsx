import AuthPage from "../components/AuthPage/AuthPage";
import RouterLink from "../components/RouterLink/RouterLink";

export default function LoginPage() {
	return (
		<AuthPage
			type="login"
			afterForm={
				<p>
					Need an account? <RouterLink to="/signup">Sign up</RouterLink>
				</p>
			}
		/>
	);
}
