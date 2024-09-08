import { useCallback, useEffect, useRef } from "react";

export function useTimer() {
	const callbackRef = useRef<(() => void) | null>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearTimer = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);

			timerRef.current = null;
		}
	}, []);

	const setTimer = useCallback(
		(callback: () => void, delay: number) => {
			clearTimer();

			callbackRef.current = callback;
			timerRef.current = setTimeout(() => {
				timerRef.current = null;

				if (typeof callbackRef.current === "function") {
					callbackRef.current();
				}
			}, Number(delay));
		},
		[clearTimer]
	);

	useEffect(() => {
		return clearTimer;
	}, [clearTimer]);

	return { setTimer, clearTimer };
}
