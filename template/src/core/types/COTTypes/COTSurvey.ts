declare interface COTSurvey {
  chat: QuestionChat[]
  _id: ObjectId
  code: String
}

declare type PopulatedCOTSurvey = COTSurvey & { chat: QuestionChat }

declare interface QuestionChat {
  _id: ObjectId
  contentArray: COTQuestion[]
  isActive: boolean
}

declare interface COTSurveyChat {
  _id?: ObjectId
  isActive : boolean,
  isSystemModel : false,
  contentType : "application/vnd.cotalker.survey",
  sender : "#system"|"#user"
  survey: ObjectId
  contentArray: ObjectId[]
  order: number
}

declare interface Question {
  identifier: string,
  display: string[]
  contentType: string
  code: string
}