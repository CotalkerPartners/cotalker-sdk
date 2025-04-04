export declare interface ScheduleBody {
	code: string;
	owner: string;
	priority?: number;
	timeoutMinutes?: number;
	runVersion?: "v1" | "v2" | "v3";
	execPath: string;
	body?: ScheduleBotBody;
	time?: Date;
}

type BotNext =
	| Record<"DEFAULT", string>
	| Record<"SUCCESS" | "ERROR", string>
	| Record<"CREATED" | "NOT-CREATED", string>
	| Record<"STEP" | "DONE", string>;
declare interface BotStage {
	name: string;
	key: string;
	data: Record<string, unknown>;
	next: BotNext;
}

export interface SchedulePostResponse {
	company: string;
	user: string;
	owner: string;
	code: string;
	time: Date;
	timeoutMinutes: number;
	cronTimeZone: string;
	body: Body;
	isSystem: boolean;
	execPath: string;
	status: string;
	priority: number;
	hooks: any[];
	tags: any[];
	createdAt: Date;
	jobModifiedAt: Date;
	runVersion: string;
	_id: string;
	modifiedAt: Date;
	__v: number;
}

export declare interface ScheduleBotBody {
	start: string;
	version: 1 | 2 | 3;
	maxIterations: number;
	stages: BotStage[];
	data: Record<string, unknown>;
}
