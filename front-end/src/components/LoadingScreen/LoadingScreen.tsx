import { useEffect, useState } from "react";
import { useTimer } from "../../hooks/timer";

export default function LoadingScreen() {
	const { setTimer } = useTimer();
	const [showScreen, setShowScreen] = useState(false);

	useEffect(() => {
		setTimer(() => setShowScreen(true), 500);
	}, [setTimer]);

	if (!showScreen) {
		return null;
	}

	return (
		<div data-testid="loading-screen" className="h-full flex items-center justify-center">
			Loading...
		</div>
	);
}
