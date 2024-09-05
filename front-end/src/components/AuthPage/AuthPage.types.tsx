import { ReactNode } from "react";
import { AuthFormTypes } from "../AuthForm/AuthForm.types";

export interface AuthPageProps {
	type: AuthFormTypes;
	afterForm?: ReactNode;
}
