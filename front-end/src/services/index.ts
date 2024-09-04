export const POSTwithoutRespData = <Payload = unknown>(url: string, payload?: Payload) => {
	return fetch(url, {
		method: "POST",
		body: payload ? JSON.stringify(payload) : undefined,
	});
};

export const POST = async <Payload = unknown, Data = unknown>(
	url: string,
	payload?: Payload
): Promise<Data> => {
	try {
		const response = await POSTwithoutRespData<Payload>(url, payload);

		return response.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

export const GET = async <Data = unknown>(
	url: string,
	requestInit?: RequestInit
): Promise<Data> => {
	try {
		const response = await fetch(url, requestInit);

		return response.json();
	} catch (error) {
		return Promise.reject(error);
	}
};
