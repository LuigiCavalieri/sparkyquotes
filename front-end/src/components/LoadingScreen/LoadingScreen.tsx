import { useEffect, useState } from "react";

export default function LoadingScreen() {
	const [showScreen, setShowScreen] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setShowScreen(true), 500);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	if (!showScreen) {
		return null;
	}

	return (
		<div data-testid="loading-screen" className="h-full flex items-center justify-center">
			Loading...
		</div>
	);
}
