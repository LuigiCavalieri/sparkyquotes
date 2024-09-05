import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { AuthLayoutProps } from "./AuthLayout.types";
import { pageItems } from "../../config/pageItems";

export default function AuthLayout({ children }: AuthLayoutProps) {
	const { isLoggedIn, isQuering } = useAuth();

	if (isQuering) {
		return <LoadingScreen />;
	}

	if (isLoggedIn) {
		return <Navigate to={pageItems.admin.url} />;
	}

	return (
		<div className="bg-sky-100 min-h-screen flex items-center">
			<div className="bg-white border border-slate-400 px-10 py-5 w-full min-h-80 flex flex-col sm:w-96 sm:px-5 sm:rounded-lg sm:mx-auto">
				{children}
			</div>
		</div>
	);
}
