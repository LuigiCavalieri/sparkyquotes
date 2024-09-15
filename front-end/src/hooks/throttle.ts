import { useCallback, useEffect, useRef } from "react";

export function useThrottle() {
	const lastCallTimeRef = useRef<number>(0);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const callbackRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		return maybeClearTimer;
	}, []);

	const maybeClearTimer = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);

			timerRef.current = null;
		}
	};

	const throttle = useCallback((callback: () => void, delay = 2000) => {
		if (typeof callback !== "function") {
			return;
		}

		callbackRef.current = callback;

		const now = Date.now();
		const elapsedTime = now - lastCallTimeRef.current;

		if (elapsedTime > delay) {
			lastCallTimeRef.current = now;

			callback();
		} else if (!timerRef.current) {
			timerRef.current = setTimeout(() => {
				timerRef.current = null;
				lastCallTimeRef.current = Date.now();

				if (typeof callbackRef.current === "function") {
					callbackRef.current();
				}
			}, delay - elapsedTime);
		}
	}, []);

	return { throttle };
}
