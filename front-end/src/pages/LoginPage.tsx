import AuthLayout from "../components/AuthLayout/AuthLayout";
import RouterLink from "../components/RouterLink/RouterLink";

export default function LoginPage() {
	return (
		<AuthLayout
			type="login"
			afterForm={
				<p>
					Need an account? <RouterLink to="/signup">Sign up</RouterLink>
				</p>
			}
		/>
	);
}
