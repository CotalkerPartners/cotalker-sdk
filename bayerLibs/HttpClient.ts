import * as http from "http";
import * as https from "https";
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

declare module "axios" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface AxiosResponse<T> extends Promise<T> {}
}
const timeout = 20000;
const axiosErrorHandler = async (
	axiosError: AxiosError,
	axiosInstance: AxiosInstance
): Promise<any> => {
	const { config, response } = axiosError;
	if (
		!response ||
		axiosError.code === "ECONNRESET" ||
		response?.status === 502
	) {
		console.error(`VOID RESPONSE ERROR CODE ${axiosError.code}`);
		console.info("CONFIG:", JSON.stringify(config));
		await new Promise(resolve => setTimeout(resolve, 500));
		return await axiosInstance(config);
	}
	if (response?.status === 429) {
		console.info(
			`429 TOO MANY REQUESTS: Retrying ${config.method} ${config.url}`
		);
		const waitTime =
			Number(
				response.headers["retry-after"] ?? response.headers["Retry-After"]
			) * 1000;
		await new Promise(resolve => setTimeout(resolve, waitTime));
		return await axiosInstance(config);
	}
	if (response?.status === 404) {
		console.info(`404 NOT FOUND ${config.method} ${config.url}`);
		return Promise.resolve({ data: null });
	}
	console.error(
		"❌HTTP Request Failed with status",
		response.status,
		JSON.stringify(config, null, 2)
	);
	if (response.data) console.error(response.data);
	return Promise.reject(axiosError);
};
export default abstract class HttpClient {
	protected readonly instance: AxiosInstance;

	public constructor(baseURL: string, keepAlive?: boolean) {
		if (keepAlive) {
			console.log("USING KEEP ALIVE IN HTTPClient ⚠️");
			const httpAgent = new http.Agent({ keepAlive: true });
			const httpsAgent = new https.Agent({ keepAlive: true });
			this.instance = axios.create({
				baseURL,
				httpAgent,
				httpsAgent,
				timeout
			});
		} else {
			console.log("HTTP AGENT NULL ≠");
			this.instance = axios.create({
				baseURL,
				timeout,
				httpAgent: null,
				httpsAgent: null
			});
		}
		this._initializeResponseInterceptor();
	}

	private _initializeResponseInterceptor = () => {
		this.instance.interceptors.response.use(
			this._handleResponse,
			this._handleError
		);
	};

	static async post<T>(
		url: string,
		headers: Record<string, string>,
		body: Record<string, unknown>
	): Promise<T> {
		return (await axios({ url, data: body, method: "post", headers }))?.data;
	}

	static async get<T>(
		url: string,
		headers: Record<string, string>
	): Promise<T> {
		const staticAxios = axios.create({});
		staticAxios.interceptors.response.use(
			({ data }) => {
				return data;
			},
			async e => await axiosErrorHandler(e, staticAxios)
		);
		const response = await staticAxios({ url, method: "get", headers });
		return response;
	}

	private _handleResponse = ({ data }: AxiosResponse) => {
		return data;
	};

	protected _handleError = async (axiosError: AxiosError): Promise<any> => {
		return await axiosErrorHandler(axiosError, this.instance);
	};
}
