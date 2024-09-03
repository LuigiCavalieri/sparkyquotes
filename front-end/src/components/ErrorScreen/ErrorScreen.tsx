export default function ErrorScreen() {
	const handleOnClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		location.reload();
	};

	return (
		<div data-testid="error-screen" className="h-full flex items-center justify-center">
			<p>
				{"Something went wrong. Try to "}
				<a href="/" className="text-sky-700 underline" onClick={handleOnClick}>
					reload the page
				</a>
				{"."}
			</p>
		</div>
	);
}
