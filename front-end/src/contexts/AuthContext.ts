import { createContext } from "react";
import { UserInfo } from "../types/user";
import { AuthFormValues } from "../components/AuthForm/AuthForm.types";

export interface AuthFunctionCallbacks {
	onError?: () => void;
	onSuccess?: () => void;
}

export type AuthFunction = (payload: AuthFormValues, callbacks?: AuthFunctionCallbacks) => void;

export interface AuthContextInterface {
	isLoggedIn: boolean;
	isQuering: boolean;
	isMutating: boolean;
	errorMessage: string;
	getUserInfo: () => UserInfo | null;
	doLogin: AuthFunction;
	doSignup: AuthFunction;
	doLogout: () => void;
}

export const AuthContext = createContext<AuthContextInterface>({
	isLoggedIn: false,
	isQuering: false,
	isMutating: false,
	errorMessage: "",
	getUserInfo: () => null,
	doLogin: () => undefined,
	doSignup: () => undefined,
	doLogout: () => undefined,
});
