import { useContext } from "react";
import { QuotesContext } from "../contexts/QuotesContext";

export default function useQuotes() {
	return useContext(QuotesContext);
}
