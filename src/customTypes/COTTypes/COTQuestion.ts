import { dateQueryParams, genericQueryParams, ObjectId, objectId } from '@customTypes/custom'
import { z } from 'zod'

export declare type COTQuestionContentType =
'application/vnd.cotalker.survey+text' |
'application/vnd.cotalker.survey+listquestion' |
'application/vnd.cotalker.survey+textinput' |
'application/vnd.cotalker.survey+textnumber' |
'application/vnd.cotalker.survey+datetime' |
'application/vnd.cotalker.survey+property' |
'application/vnd.cotalker.survey+person' |
'application/vnd.cotalker.survey+calendar' |
'application/vnd.cotalker.survey+gps' |
'application/vnd.cotalker.survey+image' |
'application/vnd.cotalker.survey+signature' |
'application/vnd.cotalker.survey+file' |
'application/vnd.cotalker.survey+api' |
'application/vnd.cotalker.survey+survey'

export declare interface COTQuestionExec {
  context?: string;
  src?: string;
}

export interface COTQuestionExecFilter {
  context?: string;
  filter?: string;
  src?: string;
}

export declare interface COTQuestion {
  contentType: COTQuestionContentType;
  display: string[];
  code: string[];
  identifier: string;
  symbolizes?: string;
  group: ObjectId;
  company: ObjectId;
  min: number;
  max: number;
  isActive: boolean;
  modifiedAt: Date;
  hideEmpty: boolean;
  isSystemModel: boolean;
  isReadOnly: boolean;
  required: boolean;
  textAlign?: string;
  responses?: string[];
  command: {
    commands: string[];
    isCommanded: string;
    values: { op: '='; target: string }[];
  };
  exec?: {
    preload?: COTQuestionExec;
    onDisplay?: COTQuestionExec;
    filter?: COTQuestionExecFilter;
    validate?: COTQuestionExec;
    onChange?: COTQuestionExec;
    presave?: COTQuestionExec;
    postsave?: COTQuestionExec;
  };
  subtype?: string;
  skipCodeValidation?: boolean;
}

const questionQueryParamsSpecific = z.object({
  ids: objectId,
  _id: objectId,
  debug: z.literal('true'),
}).partial().strict()

export const questionQueryParams = questionQueryParamsSpecific.merge(genericQueryParams).merge(dateQueryParams)
export type QuestionQueryParams = z.infer<typeof questionQueryParams>
