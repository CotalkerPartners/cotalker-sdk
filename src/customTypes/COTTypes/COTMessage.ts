import { ObjectId } from '@customTypes/custom'

export type SendMsgBody = {
  channel: ObjectId,
  content: string,
  contentType: 'text/system' | 'text/plain',
  isSaved: 2,
  sentBy: ObjectId
} 

export type EditMsgBody = {
  channel: ObjectId,
  content: string,
  isSaved: 2,
} 
