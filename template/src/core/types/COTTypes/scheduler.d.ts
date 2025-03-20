declare interface ScheduleBody {
  code: string; owner: string;
  priority?: number; timeoutMinutes?: number
  runVersion?: 'v1' | 'v2' | 'v3'
  execPath: string
  body?: ScheduleBotBody
  time?: Date,
  exponentialBackoff?: ScheduleExponentialBackoff
  hooks: ScheduleHook[]
}

declare type COTSchedule = {
 _id: ObjectId
} & ScheduleBody

type botNext =
  Record<'DEFAULT',string | undefined>|
  Record<'SUCCESS'|'ERROR',string | undefined>|
  Record<'CREATED'|'NOT-CREATED',string | undefined>|
  Record<'STEP'|'DONE',string | undefined>|
  Record<'IF'|'ELSE',string | undefined>
declare type botStage = {
  name: string
  key: string
  version?: string
  data: Record<string, unknown>
  next: botNext
}

interface SchedulePostResponse {
  _id: ObjectId
}

declare interface ScheduleBotBody {
  start: string
  version: 1 | 2 | 3
  maxIterations: number,
  stages: botStage[]
  data: Record<string, unknown>
}

declare type ScheduleHookEvent = 'on-error' | 'on-success' | 'on-finish' | 'on-start'

declare type ScheduleHook = {
  event: ScheduleHookEvent,
  api: string,
  url: string
}

declare type ScheduleExponentialBackoff = {
  maxRetries?: number
  periodMinutes?: number
  retryCount?: number
}

declare type schedulePBBodyFactoryOptions = {
  timestampCode?: boolean,
  startKey?: string,
  timeoutMinutes?: number,
  runVersion?: 'v1'|'v2',
  maxIterations?: number,
  priority?: number,
  exponentialBackoff?: ScheduleExponentialBackoff | null
  hooks?: ScheduleHook[]
}

declare type ScheduleLog = {
  _id: ObjectId
  scheduleId: ObjectId
  output?: string
}
