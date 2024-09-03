// import { ChangeEvent, useCallback, useMemo, useState } from "react";
import QuotesProvider from "../providers/QuotesProvider";
import QuotesList from "../components/QuotesList/QuotesList";
import QuoteForm from "../components/QuoteForm/QuoteForm";
// import appConfig from "../config/appConfig";
// import { Todo } from "../types/todo";

// import TextField from "../components/TextField/TextField";
// import TodoList from "../components/TodoList/TodoList";
// import TodoListSectionHead from "../components/TodoListSectionHead/TodoListSectionHead";
// import ErrorMessage from "../components/ErrorMessage/ErrorMessage";
// import { useTodos } from "../hooks/todos";

export default function ListPage() {
	return (
		<QuotesProvider>
			<QuoteForm />
			<QuotesList />
		</QuotesProvider>
	);
}
