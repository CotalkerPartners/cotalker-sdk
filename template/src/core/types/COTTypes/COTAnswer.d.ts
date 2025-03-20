declare type COTAnswerData = {
  code: string[]
  identifier: string
  contentType: COTQuestionContentType
  process: string[]
  responses: string[]
  group: string
  user: ObjectId
}
declare interface COTAnswer {
  _id: ObjectId
  uuid: string
  survey: ObjectId
  channel: ObjectId
  user: ObjectId
  properties: ObjectId[]
  propertyTypes: string[]
  identifiersNeeded: string[]
  extendsAnswer: ObjectId[]
  rExtendsAnswer: ObjectId[]
  data: COTAnswerData[]
  createdAt: string
  modifiedAt: string

  score: {
    main: number,
    scores: {
      key: string,
      value: unknown,
    }[]
  }
}