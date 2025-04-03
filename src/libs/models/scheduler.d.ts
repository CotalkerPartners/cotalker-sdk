// src/customTypes/scheduler.d.ts

declare module "@customTypes/scheduler" {
	export interface ScheduleBody {
		code: string;
		owner: string;
		priority?: number;
		timeoutMinutes?: number;
		runVersion?: "v1" | "v2" | "v3";
		execPath: string;
		body?: ScheduleBotBody;
		time?: Date;
	}

	export type botNext =
		| Record<"ERROR", string>
		| Record<"DEFAULT", string>
		| Record<"SUCCESS" | "ERROR", string>
		| Record<"CREATED" | "NOT-CREATED", string>
		| Record<"STEP" | "DONE", string>
		| Record<"IF" | "ELSE", string>;

	export type botStage = {
		name: string;
		key: string;
		data: Record<string, unknown> | string;
		next: botNext;
	};

	export interface ScheduleBotBody {
		start: string;
		version: 1 | 2 | 3;
		maxIterations: number;
		stages: botStage[];
		data: Record<string, unknown>;
	}

	export interface SchedulePostResponse {
		code: string;
		status?: string;
		message?: string;
		[key: string]: any;
	}
}
