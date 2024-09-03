import QuotesProvider from "../providers/QuotesProvider";
import QuotesList from "../components/QuotesList/QuotesList";
import QuoteForm from "../components/QuoteForm/QuoteForm";
import RandomQuote from "../components/RandomQuote/RandomQuote";

export default function ListPage() {
	return (
		<QuotesProvider>
			<RandomQuote />
			<QuoteForm />
			<QuotesList />
		</QuotesProvider>
	);
}
