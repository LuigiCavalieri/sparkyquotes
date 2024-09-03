import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider from "./providers/AuthProvider";
import ErrorBoundary from "./library/ErrorBoundary";
import ErrorScreen from "./components/ErrorScreen/ErrorScreen";
import appConfig from "./config/appConfig";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			staleTime: appConfig.reactQueryStaleTime,
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ErrorBoundary fallback={<ErrorScreen />}>
				<AuthProvider>
					<HelmetProvider>
						<Outlet />
					</HelmetProvider>
				</AuthProvider>
			</ErrorBoundary>
		</QueryClientProvider>
	);
}
