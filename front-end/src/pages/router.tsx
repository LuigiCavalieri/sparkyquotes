import { createBrowserRouter, Navigate } from "react-router-dom";
import { pageItems } from "../config/pageItems";

import App from "../App";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import ListPage from "./ListPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import NotFoundPage from "./NotFoundPage";
import ActivateAccountPage from "./ActivateAccountPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: pageItems.login.url,
				element: <LoginPage />,
			},
			{
				path: pageItems.signup.url,
				element: <SignupPage />,
			},
			{
				path: pageItems.activateAccount.url,
				element: <ActivateAccountPage />,
			},
			{
				path: pageItems.list.url,
				element: <AdminLayout />,
				children: [
					{
						index: true,
						element: <ListPage />,
					},
				],
			},
			{
				path: pageItems.admin.url,
				element: <Navigate to={pageItems.list.url} />,
			},
		],
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);

export default router;
