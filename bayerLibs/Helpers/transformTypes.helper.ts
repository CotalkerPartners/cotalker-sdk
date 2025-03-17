class TransformTypes {
	static toString(value: string | number | boolean): string {
		if (typeof value === "string") return String(value.trim());
		if (typeof value === "number" || typeof value === "boolean")
			return String(value);
		throw new Error(`Cannot transform value ${value} to string`);
	}

	static toNumber(value: string | number): number {
		if (typeof value === "string" && !Number.isNaN(Number(value.trim())))
			return Number(value.trim());
		if (typeof value === "number") return value;
		throw new Error(`Cannot transform value ${value} to number`);
	}
}

export default TransformTypes;
