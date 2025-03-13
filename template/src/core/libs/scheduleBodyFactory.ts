export default function schedulePBBodyFactory(
  code: string, owner: string,
  stages: botStage[],
  data: Record<string, unknown>,
  options?: schedulePBBodyFactoryOptions
): ScheduleBody {
  const options_: Required<schedulePBBodyFactoryOptions> = {
    startKey: options?.startKey ?? stages[0].key ?? 'start',
    timeoutMinutes: options?.timeoutMinutes ?? 10,
    timestampCode: options?.timestampCode ?? true,
    runVersion: options?.runVersion ?? 'v2',
    maxIterations: options?.maxIterations ?? ((stages.length ?? 0) + 1),
    priority: options?.priority ?? 6,
    exponentialBackoff: options?.exponentialBackoff ?? {
      maxRetries: 0, periodMinutes: 1, retryCount: 0
    },
    hooks: options?.hooks ?? []
  }
  return {
    code: (code + (options_.timestampCode ? `_${Date.now()}`: '')),
    owner, timeoutMinutes: options_.timeoutMinutes,
    execPath: './../scripts/parametrizedBots/pb.controller.js',
    runVersion: options_.runVersion, priority: options_.priority,
    body: {
      start: options_.startKey,
      version:3,
      maxIterations: options_.maxIterations,
      data, stages,
    },
    hooks: options_.hooks,
    exponentialBackoff: options_.exponentialBackoff,
  }
}
