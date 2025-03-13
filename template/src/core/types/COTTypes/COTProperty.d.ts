declare interface COTProperty {
  _id: ObjectId
  subproperty?: ObjectId[]
  name: { code: string, display: string }
  createdAt: string
  modifiedAt: string
  propertyType: string
  extra?: Record<string, unknown>
  schemaInstance?: Record<string, unknown>
  owner?: Record<string, string>
  isActive?: Boolean
}

declare type COTPropertyPostBody = Omit<COTProperty,'_id'|'createdAt'|'modifiedAt'>
