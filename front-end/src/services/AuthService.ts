import { POSTwithoutRespData, POST, GET } from ".";
import { AuthFormValues } from "../components/AuthForm/AuthForm.types";
import { endpointsUrl } from "../config/endpointsUrl";

export const login = (payload: AuthFormValues) => {
	return POSTwithoutRespData(endpointsUrl.login, payload);
};

export const signup = (payload: AuthFormValues) => {
	return POST(endpointsUrl.signup, payload);
};

export const logout = () => {
	return POSTwithoutRespData(endpointsUrl.logout);
};

export const me = () => {
	return GET(endpointsUrl.me);
};
