import { COTTask } from "@customTypes/COTTypes/COTTask";
import { COTUser } from "@customTypes/COTTypes/COTUser";
import { ObjectId } from "@customTypes/custom";
import { AxiosInstance } from "axios";
import { subYears } from "date-fns";
import { OpenAI } from "openai";

import { CotalkerAPI } from "../CotalkerAPI";
import COTMessageClient from "./COTMessageClient";
import { resolveIntent } from "./COTResolveIntent";

interface AssistantClientOptions {
	taskGroupId: string;
	openaiKey: string;
	axiosInstance: AxiosInstance;
}

type SummaryParams = {
	channelId: ObjectId;
	openaiToken: string;
	date?: Date;
	limit_char?: number;
	model?: string;
	systemPrompt?: string;
};

type Message = {
	content: string;
	contentType: string;
	// puedes agregar otros campos si los necesitas
};

export class COTAssistantClient {
	private api: CotalkerAPI;

	private taskGroupId: string;

	private openai: OpenAI;

	private openaiToken: string;

	private messageClient: COTMessageClient;

	private statusMap: Record<string, string> = {};

	private stateMap: Record<string, string> = {};

	private userMap: Record<string, string> = {};

	constructor(api: CotalkerAPI, options: AssistantClientOptions) {
		this.api = api;
		this.taskGroupId = options.taskGroupId;
		this.openaiToken = options.openaiKey;
		this.openai = new OpenAI({ apiKey: this.openaiToken });
		this.messageClient = new COTMessageClient(options.axiosInstance);
	}

	public setToken(token: string) {
		this.openaiToken = token;
		this.openai = new OpenAI({ apiKey: token });
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
				state?.property?.translations?.es?.trim();
			if (state._id && name) {
				this.stateMap[state._id] = name;
			}
		});
	}

	public async interpretMessage(
		message: string,
		userId?: string
	): Promise<string> {
		let effectiveUserId = userId;
		if (!effectiveUserId) {
			const me = await this.api.getCOTUserClient().getMe();
			effectiveUserId = me._id;
		}

		const { intent, date } = await resolveIntent(message, this.openaiToken);
		const validDate = date ?? new Date();
		const taskClient = this.api.getCOTTaskClient();
		const [user]: COTUser[] = await this.api
			.getCOTUserClient()
			.getUsersById([effectiveUserId]);

		const nameUser =
			user?.name?.displayName?.trim() ||
			user?.name?.names?.trim() ||
			"Usuario";
		let tasks: COTTask[] = [];

		switch (intent) {
			case "tasks_today":
				tasks = await taskClient.getTasks(
					{
						assignedTo: effectiveUserId,
						startDate: validDate.toISOString().split("T")[0],
						endDate: validDate.toISOString().split("T")[0]
					},
					this.taskGroupId
				);
				this.extractStatusMapFromTasks(tasks);
				break;
			case "tasks_overdue": {
				const today = new Date().toISOString().split("T")[0];
				const allTasks = await taskClient.getTasks(
					{
						assignedTo: effectiveUserId,
						startDate: "2020-01-01",
						endDate: today
					},
					this.taskGroupId
				);
				this.extractStatusMapFromTasks(allTasks);
				tasks = allTasks.filter(
					(task) => task.endDate && task.endDate.split("T")[0] < today
				);
				break;
			}
			case "tasks_by_state":
			case "team_tasks_today":
			default:
				tasks = await taskClient.getTasks(
					{ assignedTo: effectiveUserId },
					this.taskGroupId
				);
				break;
		}

		const uniqueAssigneeIds: string[] = [
			...new Set(
				tasks
					.map((t) => {
						if (typeof t.assignee === "string") return t.assignee;
						if (
							t.assignee &&
							typeof t.assignee === "object" &&
							"_id" in t.assignee
						) {
							return (t.assignee as { _id: string })._id;
						}
						return undefined;
					})
					.filter((id): id is string => typeof id === "string")
			)
		];

		const userList: COTUser[] = await this.api
			.getCOTUserClient()
			.getUsersById(uniqueAssigneeIds);

		userList.forEach((u: any) => {
			const name =
				u?.name?.displayName?.trim() || u?.name?.names?.trim() || u._id;
			this.userMap[u._id] = name;
		});

		if (!tasks.length) {
			return `Hola ${nameUser}, no se encontraron tareas relevantes para tu solicitud.`;
		}
		await this.loadStates();

		return this.summarizeTasksWithGPT(nameUser, tasks, message);
	}

	private getTaskDueDate(task: COTTask): string {
		return task.endDate ? task.endDate.split("T")[0] : "N/A";
	}

	private async summarizeTasksWithGPT(
		userName: string,
		tasks: COTTask[],
		question: string
	): Promise<string> {
		const taskDescriptions = tasks
			.map((task, i) => {
				const fecha = this.getTaskDueDate(task);
				const asignadoId =
					typeof task.assignee === "string"
						? task.assignee
						: task.assignee && "_id" in task.assignee
							? (task.assignee as { _id: string })._id
							: undefined;
				const asignado =
					this.userMap[asignadoId] || asignadoId || "Sin asignado";
				const nombre = task.name ?? "Sin nombre";
				const estado =
					typeof task.smState === "string"
						? (this.stateMap[task.smState] ?? "Sin estado definido")
						: "Sin estado";
				return `${i + 1}. ${nombre} (vence: ${fecha}, estado: ${estado}, asignado a: ${asignado})`;
			})
			.join("\n");

		const prompt = `
Eres un asistente experto en gestión de tareas. Un usuario llamado ${userName} te ha hecho la siguiente pregunta: "${question}".

Aquí tienes el resumen de sus tareas:
${taskDescriptions || "(sin tareas)"}

Redacta una respuesta clara, natural y amigable basada en esta información. Si no hay tareas, tranquilízalo de manera positiva.
`.trim();

		const result = await this.openai.chat.completions.create({
			model: "gpt-4o",
			messages: [{ role: "user", content: prompt }],
			max_tokens: 16383,
			temperature: 0.7
		});

		const respuestaGPT = result.choices[0]?.message?.content?.trim();
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
				max_tokens: 16383,
				temperature: 0.7
			});
			const fallbackContent =
				fallbackResult.choices[0]?.message?.content?.trim();
			return (
				fallbackContent ||
				"No se pudo generar un resumen aún después de reintentar."
			);
		}

		return respuestaGPT;
	}

	public async generateSummary({
		channelId,
		openaiToken,
		date = subYears(new Date(), 1),
		limit_char = 100000,
		model = "gpt-3.5-turbo",
		systemPrompt = "Resume los siguientes mensajes de canal interno. Agrupa las ideas principales y expresa cada una como un bullet. Si hay ideas repetidas, fusiónalas. Ignora mensajes irrelevantes como saludos, links o imágenes. Destaca acciones importantes, decisiones tomadas o recomendaciones técnicas."
	}: SummaryParams): Promise<string | undefined> {
		// aseguramos el token para este uso
		this.setToken(openaiToken);

		// obtenemos mensajes desde el canal
		const result = await this.messageClient.getMessages(channelId, date);
		const messages: Message[] = Array.isArray(result)
			? result
			: ((result as any)?.messages ?? []);

		if (!Array.isArray(messages)) {
			throw new Error(
				"La respuesta de getMessages no es un array válido."
			);
		}

		// concatenamos el contenido de mensajes de texto plano
		const fullText = messages
			.filter((m) => m.contentType === "text/plain")
			.map((m) => m.content)
			.join("\n");

		if (!fullText.trim()) return undefined;

		const limitedText = fullText.slice(-limit_char);

		// generamos el resumen con OpenAI
		const summaryResponse = await this.openai.chat.completions.create({
			model,
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: limitedText }
			]
		});

		return summaryResponse.choices[0]?.message?.content?.trim();
	}
}
