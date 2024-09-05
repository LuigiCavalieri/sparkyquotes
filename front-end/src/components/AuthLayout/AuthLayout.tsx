import { AuthLayoutProps } from "./AuthLayout.types";

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="bg-sky-100 min-h-screen flex items-center">
			<div className="bg-white border border-slate-400 px-10 py-5 w-full min-h-80 flex flex-col sm:w-96 sm:px-5 sm:rounded-lg sm:mx-auto">
				{children}
			</div>
		</div>
	);
}
