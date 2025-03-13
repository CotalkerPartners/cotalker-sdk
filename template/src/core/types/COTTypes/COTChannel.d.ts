declare interface COTChannel {
  _id: ObjectId
  group: ObjectId
  nameCode: string
  nameDisplay: string
  userIds: string[]
}

declare type COTChannelPostBody = Omit<COTChannel,'_id'>