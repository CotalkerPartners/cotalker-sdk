import Event from "src/interfaces/Event";

class HandlerEvent {
	static getBody<T>(event: Event): T {
		const body = event.body;
		if (!body) throw new Error("Body Not Found");
		if (typeof body === "string") return JSON.parse(body);
		if (typeof body === "object") return body as T;
		throw new Error("typeof body is not compatible");
	}

	static getParameters<T>(event: Event): T {
		const queryParams = event.pathParameters;
		if (!queryParams) throw new Error("Params not Found");
		return queryParams as T;
	}

	static getQueryParams<T>(event: Event): T {
		const queryString = event.queryStringParameters;
		if (!queryString) throw new Error("Query Params not Found");
		return queryString as T;
	}
}

export default HandlerEvent;
