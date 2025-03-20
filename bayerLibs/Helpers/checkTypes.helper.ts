class CheckTypes {
	static isNumber(value: unknown) {
		if (value === undefined || value === null)
			throw new CheckTypeHandler("Value cannot be Empty", "EmptyError");
		if (Number.isNaN(Number(value)))
			throw new CheckTypeHandler("Value is not a Number", "ValidationError");
	}

	static isString(value: unknown) {
		if (!value)
			throw new CheckTypeHandler("Value cannot be empty", "EmptyError");
		if (typeof value === "string" && value.trim() === "")
			throw new CheckTypeHandler("Value cannot be empty", "EmptyError");
	}
}

class CheckTypeHandler extends Error {
	constructor(message: string, name: HandlerTypes) {
		super(message);
		this.name = name;
	}
}

type HandlerTypes = "EmptyError" | "ValidationError";

export default CheckTypes;
export { CheckTypeHandler, HandlerTypes };
