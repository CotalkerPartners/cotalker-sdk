class EmptyError extends Error {
	constructor(variable: string) {
		super(`Variable ${variable} not found`);
		this.name = "EMPTY_VARIABLE";
	}
}

class NumberError extends Error {
	constructor(variable: string) {
		super(`Variable ${variable} is not a Number`);
		this.name = "DATATYPE_ERROR";
	}
}

class TypeError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DATATYPE_ERROR";
	}
}

export { EmptyError, NumberError, TypeError };
