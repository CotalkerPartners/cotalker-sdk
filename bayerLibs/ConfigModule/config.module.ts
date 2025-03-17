import * as dotenv from "dotenv";
import ConfigVariables from "./config.interface";
import { EmptyError, NumberError } from "./config.error";

dotenv.config();

class ConfigModule<Environment> {
	readonly #environment: Environment;

	constructor(variables: ConfigVariables<Environment>[]) {
		this.#environment = this.#initEnvironment(variables);
	}

	#initEnvironment(variables: ConfigVariables<Environment>[]) {
		const environmentVariables = {} as Environment;

		variables.forEach(variable => {
			const name = String(variable.name);
			switch (variable.dataType) {
				case "string":
					environmentVariables[name] = this.#toString(name);
					break;
				case "number":
					environmentVariables[name] = this.#toNumber(name);
					break;
				default:
					throw new TypeError("Datatype is not allow");
			}
		});

		return { ...environmentVariables };
	}

	#toNumber(variable: string) {
		const environment = Number(process.env[variable]);
		if (environment === undefined || environment === null)
			throw new EmptyError(variable);
		if (Number.isNaN(environment)) throw new NumberError(variable);
		return environment;
	}

	#toString(variable: string): string {
		const environment = process.env[variable];
		if (!environment) throw new EmptyError(variable);
		return environment;
	}

	get<EnvironmentKey extends keyof Environment>(key: EnvironmentKey) {
		return this.#environment[key];
	}
}

export default ConfigModule;
