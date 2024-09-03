import { ReactNode } from "react";
import { AuthFormTypes } from "../AuthForm/AuthForm.types";

export interface AuthLayoutProps {
	type: AuthFormTypes;
	afterForm?: ReactNode;
}
