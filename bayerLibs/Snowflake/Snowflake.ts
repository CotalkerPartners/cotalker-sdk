import * as snowflake from "snowflake-sdk";
import { Connection, ConnectionOptions } from "snowflake-sdk";

class Snowflake<T> {
	#connection: Connection;

	constructor(options: ConnectionOptions) {
		this.#connection = snowflake.createConnection(options);
	}

	async connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.#connection.connectAsync((err, _conn) => {
				if (err) {
					return reject(
						new Error(
							`Error al conectar a Snowflake ${err.message}`
						)
					);
				}
				console.log("Conexión exitosa");
				return resolve();
			});
		});
	}

	async execQuery(query: string): Promise<T[] | undefined> {
		return new Promise((resolve, reject) => {
			this.#connection.execute({
				sqlText: query,
				complete: (err, _stmt, rows) => {
					if (err) {
						reject(
							new Error(`Error en la consulta: ${err.message}`)
						);
						return;
					}
					return resolve(rows);
				}
			});
		});
	}

	isUp(): boolean {
		return this.#connection.isUp();
	}

	get id(): string {
		return this.#connection.getId();
	}

	destroy(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.#connection.destroy((err, _conn) => {
				if (err) {
					return reject(
						new Error(`Error en cerrar la conexión: ${err.message}`)
					);
				}
				console.log("Conexión cerrada correctamente");
				return resolve();
			});
		});
	}
}

export default Snowflake;
