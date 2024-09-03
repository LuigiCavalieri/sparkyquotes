import { useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../hooks/auth";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { pageItems } from "../../config/pageItems";
import appConfig from "../../config/appConfig";

export default function AdminLayout() {
	const { pathname } = useLocation();
	const { isLoggedIn, isQuering, doLogout, getUserInfo } = useAuth();

	const pageTitle = useMemo(() => {
		const item = Object.values(pageItems).find(item => item.url === pathname);

		return item?.pageTitle || "";
	}, [pathname]);

	if (isQuering) {
		return <LoadingScreen />;
	}

	if (!isLoggedIn) {
		return <Navigate to={pageItems.login.url} />;
	}

	return (
		<main className="bg-sky-100 min-h-screen flex-grow">
			{pageTitle && (
				<Helmet>
					<title>{`${pageTitle} | ${appConfig.appName}`}</title>
				</Helmet>
			)}
			<header className="h-12 px-5 bg-sky-700">
				<div className="container text-white h-full flex justify-between">
					<h1 className="font-bold text-xl md:text-2xl my-auto">{appConfig.appName}</h1>
					<div className="my-auto">
						<span className="text-xs">{`Hello ${getUserInfo()?.name}! — `}</span>
						<button data-testid="logout-button" className="text-sm leading-none underline" onClick={() => doLogout()}>
							Log out
						</button>
					</div>
				</div>
			</header>
			<div className="container flex flex-col gap-8 pt-8 md:pb-8">
				<Outlet />
			</div>
		</main>
	);
}
