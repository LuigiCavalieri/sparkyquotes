import "./library/fetch-interceptor";

export const POSTwithoutResponse = <Payload = unknown>(url: string, payload?: Payload) => {
	return fetch(url, {
		method: "POST",
		body: payload ? JSON.stringify(payload) : undefined,
	});
};

export const POST = async <Payload = unknown>(url: string, payload?: Payload) => {
	try {
		const response = await POSTwithoutResponse<Payload>(url, payload);

		return response.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

export const GET = async (url: string) => {
	try {
		const response = await fetch(url);

		return response.json();
	} catch (error) {
		return Promise.reject(error);
	}
};
