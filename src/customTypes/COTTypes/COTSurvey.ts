import { genericQueryParams, ObjectId } from '@customTypes/custom'
import { z } from 'zod'

export declare interface COTSurvey {
  chat: QuestionChat[];
  _id: ObjectId;
  code: string;
}

export declare interface QuestionChat {
  contentArray: Question[];
  isActive: boolean;
}

export declare interface Question {
  identifier: string;
  display: string[];
  contentType: string;
  code: string;
}

const surveysQueryParamsSpecific =  z.object({
  search: z.string(),
  answer: z.string().or(z.array(z.string())),
  select: z.string().or(z.array(z.string())),
  debug: z.string(),
}).partial().strict()

export const surveysQueryParams = surveysQueryParamsSpecific.merge(genericQueryParams)
export type SurveysQueryParams = z.infer<typeof surveysQueryParams>
