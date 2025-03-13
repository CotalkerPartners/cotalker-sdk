declare class COTTask {
  _id: ObjectId
  editors: ObjectId[]
  followers: ObjectId[]
  visibility: ObjectId[]

  serial: number | number[]

  closedAt: string
  modifiedStateAt: string

  channelType: 'bound' | 'unbound' | 'unbound-hierarchy';

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
  owner: ObjectId;

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
  estimatedTime?: number

  smStateMachine: ObjectId
  smState: ObjectId
  status: ObjectId
  startDate?: Date
  resolutionDate?: string
  endDate?: string
  lastMessage?: {
    content: string
    date: string
  }
  color: 'none' | 'red' | 'blue' | 'green' | 'yellow'
  extensions: Record<string, Record<string, any>>
}

declare type COTTaskPostData = Pick<COTTask,
  'taskGroup'|'name'|'userList'|'assignee'|'followers'|'editors'|
  'startDate'|'endDate'|'estimatedTime'|'channel' |
  'status1'|'status2'|'status3'|'status4'|'status5'|'extensions'>
declare type COTTaskPatchData = Partial<Omit<COTTaskPostData, 'taskGroup'>>&{ isActive?: boolean, smState?: ObjectId, visibility?: ObjectId[] }

type singleOrMultiObjectId = ObjectId | { $in: ObjectId[] }
type dateQuery = string | Partial<Record<'$gt'|'$gte'|'$lt'|'$lte', string | Date>>
declare type COTTaskQuery = {
  isActive?: boolean, _id?: singleOrMultiObjectId
  assignee?: ObjectId, serial?: number | number[]
  userList?: singleOrMultiObjectId
  channel?: singleOrMultiObjectId
  smState?: singleOrMultiObjectId | { $ne: ObjectId }
  status?: singleOrMultiObjectId
  status1?: singleOrMultiObjectId
  status2?: singleOrMultiObjectId
  status3?: singleOrMultiObjectId
  status4?: singleOrMultiObjectId
  status5?: singleOrMultiObjectId
  createdAt?: dateQuery, startDate?: dateQuery, endDate?: dateQuery
  name?: string | { '$regex' : string }
  limit?: number, skip?: number
  fields?: (keyof COTTask)[]
}

declare type queryTaskFilterOptions = {
  limit?: number, limitBy?: 'all' | 'group'
}

declare type FilteredTasks = {
  _id: {
    key: string
    display: string
    type: string
    id: string
  }[]
  tasks: COTTask[]
}

declare type SMStateChange = {
  task: ObjectId
  currentState: ObjectId
  createdAt: Date
}