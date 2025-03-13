declare type COTQuestionContentType =
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

declare type COTQuestionExec = {
  context?: string
  src?: string
}

type COTQuestionExecFilter = {
  context?: string
  filter?: string
  src?: string
}

declare type COTQuestionCommand = {
  commands: string[],
  resetIdentifiers?: string[],
  isCommanded: string,
  values: { op: '='|'regex', target: string }[],
}

declare interface COTQuestion {
  _id: ObjectId;
  contentType: COTQuestionContentType;
  display: string[]
  code: string[]
  identifier: string
  symbolizes?: string
  group: ObjectId
  company: ObjectId
  min: number
  max: number
  isActive: boolean
  modifiedAt: Date
  hideEmpty: boolean
  isSystemModel: boolean
  isReadOnly: boolean
  required: boolean
  textAlign?: 'left'|'right'|'center'
  responses?: string[]
  command: COTQuestionCommand,
  exec?: {
    preload?: COTQuestionExec,
    onDisplay?: COTQuestionExec,
    filter?: COTQuestionExecFilter,
    validate?: COTQuestionExec,
    onChange?: COTQuestionExec,
    presave?: COTQuestionExec,
    postsave?: COTQuestionExec,
  };
  subtype?: string
  skipCodeValidation?: boolean
}