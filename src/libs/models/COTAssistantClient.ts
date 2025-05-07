import { COTTask } from "@customTypes/COTTypes/COTTask";
import { OpenAI } from "openai";

import { CotalkerAPI } from "../CotalkerAPI";
import { resolveIntent } from "./COTResolveIntent";

interface AssistantClientOptions {
	taskGroupId: string;
	openaiKey: string;
}

export class COTAssistantClient {
	private api: CotalkerAPI;

	private taskGroupId: string;

	private openai: OpenAI;

	private statusMap: Record<string, string> = {};

	private stateMap: Record<string, string> = {}; // idEstado → nombreEstado

	private userMap: Record<string, string> = {};

	constructor(api: CotalkerAPI, options: AssistantClientOptions) {
		this.api = api;
		this.taskGroupId = options.taskGroupId;
		this.openai = new OpenAI({ apiKey: options.openaiKey });
	}

	private extractStatusMapFromTasks(tasks: COTTask[]): void {
		tasks.forEach((task) => {
			if (task.smState) {
				this.statusMap[task.smState] = task.smState;
			}
		});
	}

	public async loadStates(): Promise<void> {
		const states = await this.api
			.getCOTTaskClient()
			.getStates(this.taskGroupId);

		states.forEach((state) => {
			const name =
				state?.property?.name?.trim() ||
				state?.property?.translations?.es?.trim(); // fallback

			if (state._id && name) {
				this.stateMap[state._id] = name;
			}
		});
	}

	public async interpretMessage(
		message: string,
		userId?: string
	): Promise<string> {
		if (!userId) {
			const me = await this.api.getCOTUserClient().getMe();
			// eslint-disable-next-line no-param-reassign
			userId = me._id;
		}

		const { intent, date } = await resolveIntent(message);
		const validDate = date ?? new Date();
		const taskClient = this.api.getCOTTaskClient();
		const [user] = await this.api.getCOTUserClient().getUsersById([userId]);
		const nameUser =
			user?.name?.displayName?.trim() ||
			user?.name?.names?.trim() ||
			"Usuario";

		let tasks: COTTask[] = [];

		switch (intent) {
			case "tasks_today": {
				const isoDate = validDate.toISOString().split("T")[0];
				tasks = await taskClient.getTasks(
					{
						assignedTo: userId,
						startDate: isoDate,
						endDate: isoDate
					},
					this.taskGroupId
				);
				this.extractStatusMapFromTasks(tasks);
				break;
			}
			case "tasks_overdue": {
				const today = new Date().toISOString().split("T")[0];
				const allTasks = await taskClient.getTasks(
					{
						assignedTo: userId,
						startDate: "2020-01-01",
						endDate: today
					},
					this.taskGroupId
				);
				this.extractStatusMapFromTasks(allTasks);
				tasks = allTasks.filter((task) => {
					const fecha = task.endDate;
					return fecha && fecha.split("T")[0] < today;
				});
				break;
			}
			case "tasks_by_state": {
				tasks = await taskClient.getTasks(
					{ assignedTo: userId },
					this.taskGroupId
				);
				this.extractStatusMapFromTasks(tasks);
				break;
			}
			case "team_tasks_today": {
				tasks = await taskClient.getTasks(
					{ assignedTo: userId },
					this.taskGroupId
				);
				break;
			}
			default:
				tasks = await taskClient.getTasks(
					{ assignedTo: userId },
					this.taskGroupId
				);
				break;
		}

		const uniqueAssigneeIds = [
			...new Set(
				tasks
					.map((t) =>
						typeof t.assignee === "string"
							? t.assignee
							: (t.assignee as { _id: string })?._id
					)
					.filter(Boolean)
			)
		];

		const userList = await this.api
			.getCOTUserClient()
			.getUsersById(uniqueAssigneeIds);

		userList.forEach((u) => {
			const nombre =
				u?.name?.displayName?.trim() || u?.name?.names?.trim() || u._id;
			this.userMap[u._id] = nombre;
		});

		if (!tasks.length) {
			return `Hola ${nameUser}, no se encontraron tareas relevantes para tu solicitud.`;
		}
		await this.loadStates();

		const gptResponse = await this.summarizeTasksWithGPT(
			nameUser,
			tasks,
			message
		);
		return gptResponse;
	}

	private getTaskDueDate(task: COTTask): string {
		const fecha = task.endDate;
		return fecha ? fecha.split("T")[0] : "N/A";
	}

	private async summarizeTasksWithGPT(
		userName: string,
		tasks: COTTask[],
		question: string
	): Promise<string> {
		// Preparamos una lista muy ligera
		const taskDescriptions = tasks
			.map((task, i) => {
				const fecha = this.getTaskDueDate(task);
				const asignadoId =
					typeof task.assignee === "string"
						? task.assignee
						: (task.assignee as { _id: string })?._id;

				const asignado =
					this.userMap[asignadoId] || asignadoId || "Sin asignado";

				const nombre = task.name ?? "Sin nombre";

				let estado = "Sin estado";

				if (typeof task.smState === "string") {
					estado =
						this.stateMap[task.smState] ?? "Sin estado definido";
				}
				//console.debug("🗺️ Mapa de estados cargado:", this.stateMap);

				return `${i + 1}. ${nombre} (vence: ${fecha}, estado: ${estado}, asignado a: ${asignado})`;
			})
			.join("\n");
		// console.debug(taskDescriptions);
		const prompt = `
	Eres un asistente experto en gestión de tareas. Un usuario llamado ${userName} te ha hecho la siguiente pregunta: "${question}".
	
	Aquí tienes el resumen de sus tareas:
	${taskDescriptions || "(sin tareas)"}
	
	Redacta una respuesta clara, natural y amigable basada en esta información. Si no hay tareas, tranquilízalo de manera positiva.
	`.trim();

		const maxTokens = 16383;

		const result = await this.openai.chat.completions.create({
			model: "gpt-4o",
			messages: [{ role: "user", content: prompt }],
			max_tokens: maxTokens,
			temperature: 0.7
		});

		const respuestaGPT = result.choices[0].message.content?.trim();

		// ⛔ Si GPT no entendió o dio respuesta ambigua, reintentamos forzando
		if (
			!respuestaGPT ||
			/no entend[ií]|no pude|no puedo|no se/i.test(respuestaGPT)
		) {
			const fallbackPrompt = `
	Eres un asistente de tareas. No importa si la pregunta es difícil o ambigua: debes siempre intentar dar una respuesta basada en la siguiente información de tareas:
	
	${taskDescriptions || "(sin tareas)"}
	
	El usuario preguntó: "${question}"
	
	Intenta siempre dar una respuesta útil basada en la información que tienes, aunque tengas que deducir o suponer de forma razonable.
	Nunca respondas "no entendí", "no pude", "no puedo" o similares.
	`.trim();

			const fallbackResult = await this.openai.chat.completions.create({
				model: "gpt-4o",
				messages: [{ role: "user", content: fallbackPrompt }],
				max_tokens: maxTokens,
				temperature: 0.7
			});

			return (
				fallbackResult.choices[0].message.content?.trim() ||
				"No se pudo generar un resumen aún después de reintentar."
			);
		}

		return respuestaGPT;
	}
}
