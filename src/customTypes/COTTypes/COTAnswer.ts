import { genericQueryParams, ObjectId, objectId } from '@customTypes/custom'
import { z } from 'zod'

import { COTQuestionContentType } from './COTQuestion'

export declare interface COTAnswerData {
  code: string[];
  identifier: string;
  contentType: COTQuestionContentType;
  process: string[];
  responses: string[];
  group: string;
  user: ObjectId;
}

export declare interface COTAnswer {
  _id: ObjectId;
  uuid: string;
  channel: ObjectId;
  user: ObjectId;
  properties: ObjectId[];
  propertyTypes: string[];
  identifiersNeeded: string[];
  extendsAnswer: ObjectId[];
  rExtendsAnswer: ObjectId[];
  data: COTAnswerData[];
  createdAt: string;
  modifiedAt: string;

  score: {
    main: number;
    scores: {
      key: string;
      value: unknown;
    }[];
  };
}

const answersQueryParamsSpecific = z.object({
  search: z.string(),
  orderBy: z.string(),
  sortBy: z.string(),
  user: objectId,
  survey: objectId,
  surveysIds: objectId,
  properties: objectId,
  answerUuids: objectId,
  fullMatchProperties: z.boolean(),
  modifiedAtGte: z.date(),
  modifiedAtLte: z.date(),
  debug: z.literal('true'),
}).partial().strict()

export const answersQueryParams = answersQueryParamsSpecific.merge(genericQueryParams)
export type AnswersQueryParams = z.infer<typeof answersQueryParams>
