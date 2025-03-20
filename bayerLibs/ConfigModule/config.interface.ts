interface ConfigVariables<T> {
	name: keyof T;
	dataType: DataType;
}

type DataType = "string" | "number";

export default ConfigVariables;
