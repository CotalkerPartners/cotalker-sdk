import { ObjectId } from '@customTypes/custom'

export declare class COTTask {
  _id: ObjectId

  editors: ObjectId[]

  followers: ObjectId[]

  visibility: ObjectId[]

  serial: number

  closedAt: string

  modifiedStateAt: string

  channelType: 'bound' | 'unbound' | 'unbound-hierarchy'

  status1?: ObjectId

  status2?: ObjectId

  status3?: ObjectId

  status4?: ObjectId

  status5?: ObjectId

  answers: string[]

  asset?: ObjectId

  // Special Users
  assignee: ObjectId

  validators: ObjectId[]

  // Owner - User that is responsible for Task Creation. E.g., set up scheduler
  owner: ObjectId

  // userList: Internal field
  // contains array with all users that have visibility: Editors + Followers + Viewers
  userList?: ObjectId[]

  // General
  modifiedAt: string

  createdAt: string

  // createdBy: used who created task (bot, user, system, etc)
  createdBy: ObjectId

  // Position
  projectCode: ObjectId

  indentation: number

  parent?: ObjectId

  relativeWeight: number

  weight: number

  // Status
  name: string

  company: ObjectId

  taskGroup: ObjectId

  survey: ObjectId

  child: ObjectId[]

  isActive: boolean

  isValid: boolean

  channel?: ObjectId

  activeSlas: ObjectId[]

  info: string

  estimatedTime: number

  smStateMachine: ObjectId

  smState: ObjectId

  status: ObjectId

  startDate?: Date

  resolutionDate?: string

  endDate?: string

  color: 'none' | 'red' | 'blue' | 'green' | 'yellow'

  extensions: Record<string, Record<string, any>>
}

export declare type COTTaskPostData = Pick<COTTask,
'taskGroup' | 'name' | 'userList' | 'assignee' | 'followers' | 'editors' |
'startDate' | 'endDate' |
'status1' | 'status2' | 'status3' | 'status4' | 'status5' | 'extensions'>
export declare type COTTaskPatchData = Partial<Omit<COTTaskPostData, 'taskGroup'>> & { isActive?: boolean; smState?: ObjectId }

type SingleOrMultiObjectId = ObjectId | { $in: ObjectId[] }
type DateQuery = string | Partial<Record<'$gt' | '$gte' | '$lt' | '$lte', string | Date>>
export declare interface COTTaskQuery {
  isActive?: boolean; _id?: SingleOrMultiObjectId;
  userList?: SingleOrMultiObjectId;
  channel?: SingleOrMultiObjectId;
  smState?: SingleOrMultiObjectId;
  status?: SingleOrMultiObjectId;
  status1?: SingleOrMultiObjectId;
  status2?: SingleOrMultiObjectId;
  status3?: SingleOrMultiObjectId;
  status4?: SingleOrMultiObjectId;
  status5?: SingleOrMultiObjectId;
  createdAt?: DateQuery; startDate?: DateQuery; endDate?: DateQuery;
}

export declare interface QueryTaskFilterOptions {
  limit?: number; limitBy?: 'all' | 'group';
}

export declare interface FilteredTasks {
  _id: {
    key: string;
    display: string;
    type: string;
    id: string;
  }[];
  tasks: COTTask[];
}

export interface MultiTaskBody {
  cmd: {
    method: string;
    task: COTTask;
  }[];
}
