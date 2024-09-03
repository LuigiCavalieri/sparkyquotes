import { ReactNode, Component } from "react";

interface Props {
	fallback: ReactNode;
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		// Define a state variable to track whether is an error or not.
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	render() {
		// Check if the error is thrown
		if (this.state.hasError) {
			return <>{this.props.fallback}</>;
		}

		return this.props.children;
	}
}
