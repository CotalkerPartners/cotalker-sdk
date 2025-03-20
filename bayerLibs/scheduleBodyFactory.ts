type schedulePBBodyFactoryOptions = {
	timestampCode?: boolean;
	startKey?: string;
	timeoutMinutes?: number;
	runVersion?: "v1" | "v2";
	maxIterations?: number;
	priority?: number;
};

export default function schedulePBBodyFactory(
	code: string,
	owner: string,
	stages: botStage[],
	data: Record<string, unknown>,
	options?: schedulePBBodyFactoryOptions
): ScheduleBody {
	const options_: Required<schedulePBBodyFactoryOptions> = {
		startKey: options?.startKey ?? stages[0].key ?? "start",
		timeoutMinutes: options?.timeoutMinutes ?? 10,
		timestampCode: options?.timestampCode ?? true,
		runVersion: options?.runVersion ?? "v2",
		maxIterations: options?.maxIterations ?? (stages.length ?? 0) + 1,
		priority: options?.priority ?? NaN
	};
	return {
		code: code + (options_.timestampCode ? `_${Date.now()}` : ""),
		owner,
		timeoutMinutes: options_.timeoutMinutes,
		execPath: "./../scripts/parametrizedBots/pb.controller.js",
		runVersion: options_.runVersion,
		priority: options_.priority,
		body: {
			start: options_.startKey,
			version: 3,
			maxIterations: options_.maxIterations,
			data,
			stages
		}
	};
}
