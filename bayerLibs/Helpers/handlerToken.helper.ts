class HandlerToken {
	readonly #authorization: string;

	constructor(authorization: string, allowEmpty: boolean = true) {
		if (allowEmpty) this.#isNotEmpty(authorization);
		this.#authorization = authorization;
	}

	get authorization(): string {
		return this.#authorization;
	}

	get prefix(): string {
		const [prefix, _token] = this.#authorization.split(" ");
		if (prefix !== "Bearer") throw new Error("Bearer prefix missing");
		return prefix;
	}

	get token(): string {
		const [_prefix, token] = this.#authorization.split(" ");
		return token;
	}

	async isValidToken(): Promise<boolean> {
		// TODO: Implementar validación
		return true;
	}

	#isNotEmpty(value: string) {
		if (!value) throw new Error("Empty Authorization");
		if (!value[0]) throw new Error("Prefix Authorization Not Found");
		if (!value[1]) throw new Error("Token Not Found");
	}
}

export default HandlerToken;
