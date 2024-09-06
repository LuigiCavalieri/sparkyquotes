import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AuthContext, AuthFunctionCallbacks } from "../contexts/AuthContext";
import { UserInfo } from "../types/user";
import { getStorageItem, removeStorageItem, setStorageItem } from "../library/local-storage";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as AuthService from "../services/AuthService";
import { AuthFormValues } from "../components/AuthForm/AuthForm.types";
import { useLocation, useNavigate } from "react-router-dom";
import { pageItems } from "../config/pageItems";
import { ResponseError } from "../types/error";

interface AuthProviderProps {
	children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const queryClient = useQueryClient();
	const mutationCallbacksRef = useRef<AuthFunctionCallbacks | null>(null);
	const userInfoRef = useRef<UserInfo | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [shouldFetch, setShouldFetch] = useState(false);

	const {
		isLoading: isDoingLogin,
		error: loginError,
		mutate: triggerLogin,
		reset: resetLoginMutation,
	} = useMutation<unknown, ResponseError, AuthFormValues>({
		mutationFn: AuthService.login,
		onSuccess: () => {
			setShouldFetch(true);

			if (typeof mutationCallbacksRef.current?.onSuccess === "function") {
				mutationCallbacksRef.current.onSuccess();
			}
		},
		onError: () => handleOnMutationError(),
	});

	const {
		isLoading: isDoingSignup,
		error: signupError,
		mutate: triggerSignup,
		reset: resetSignupMutation,
	} = useMutation<unknown, ResponseError, AuthFormValues>({
		mutationFn: AuthService.signup,
		onSuccess: () => {
			if (typeof mutationCallbacksRef.current?.onSuccess === "function") {
				mutationCallbacksRef.current.onSuccess();
			}
		},
		onError: () => handleOnMutationError(),
	});

	const { mutate: triggerLogout } = useMutation({
		mutationFn: AuthService.logout,
	});

	useQuery({
		queryFn: AuthService.me,
		enabled: shouldFetch,
		onSuccess: data => {
			userInfoRef.current = data;

			setIsLoggedIn(true);
			setShouldFetch(false);
			setStorageItem("isLoggedIn", true);
		},
		onError: () => {
			initLogout();
			setShouldFetch(false);
		},
	});

	const initLogout = useCallback(() => {
		queryClient.removeQueries();
		removeStorageItem("isLoggedIn");
	}, [queryClient]);

	const doLogin = useCallback(
		(payload: AuthFormValues, callbacks?: AuthFunctionCallbacks) => {
			mutationCallbacksRef.current = callbacks || null;

			triggerLogin(payload);
		},
		[triggerLogin]
	);

	const doSignup = useCallback(
		(payload: AuthFormValues, callbacks?: AuthFunctionCallbacks) => {
			mutationCallbacksRef.current = callbacks || null;

			triggerSignup(payload);
		},
		[triggerSignup]
	);

	const doLogout = useCallback(() => {
		initLogout();
		setIsLoggedIn(false);
		triggerLogout();
		navigate(pageItems.login.url);
	}, [initLogout, triggerLogout, navigate]);

	useEffect(() => {
		resetLoginMutation();
		resetSignupMutation();
	}, [pathname, resetLoginMutation, resetSignupMutation]);

	useLayoutEffect(() => {
		if (getStorageItem("isLoggedIn")) {
			setShouldFetch(true);
		}
	}, []);

	const getUserInfo = () => {
		return userInfoRef.current;
	};

	const handleOnMutationError = () => {
		if (typeof mutationCallbacksRef.current?.onError === "function") {
			mutationCallbacksRef.current.onError();
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn,
				isMutating: isDoingLogin || isDoingSignup,
				isQuering: shouldFetch,
				errorMessage: loginError?.message || signupError?.message || "",
				getUserInfo,
				doLogin,
				doSignup,
				doLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
