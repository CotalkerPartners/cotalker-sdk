import { COTAnswer, COTAnswerData } from '@customTypes/COTTypes/COTAnswer'
import { COTProperty } from '@customTypes/COTTypes/COTProperty'
import { COTUser } from '@customTypes/COTTypes/COTUser'
import { ObjectId } from '@customTypes/custom'

import { CotalkerAPI } from './CotalkerAPI'

export class Answer {
  public createdAt: Date

  public user: ObjectId

  private constructor(
    private API: CotalkerAPI,
    private cotAnswer: COTAnswer,
  ) {
    this.user = this.cotAnswer.user
    this.createdAt = new Date(this.cotAnswer.createdAt)
  }

  static async fromId(api: CotalkerAPI, answerId: ObjectId): Promise<Answer> {
    return new Answer(api, await api.getAnswer(answerId))
  }

  getString(identifier: string): string {
    return this.cotAnswer.data.find(d => d.identifier === identifier)?.process[0] ?? ''
  }

  getNumber(identifier: string): number {
    return parseFloat(this.cotAnswer.data.find(d => d.identifier === identifier)?.process[0] ?? '') ?? NaN
  }

  getProcess(identifier: string): string[] {
    return this.cotAnswer.data.find(d => d.identifier === identifier)?.process ?? []
  }

  getPropertyResponse<T extends COTProperty>(identifier: string): T | null {
    try {
      const resp = this.cotAnswer.data.find(d => d.identifier === identifier)?.responses[0]
      return (resp && JSON.parse(resp)) || null
    } catch (error) {
      console.error(error)
      return null
    }
  }

  getIdentifier(identifier: string): COTAnswerData | undefined {
    return this.cotAnswer.data.find(d => d.identifier === identifier)
  }

  async getSubAnswers(identifier: string, waitTime?: number): Promise<Answer[]> {
    const answerData = this.getIdentifier(identifier)
    if (!answerData) return []
    if (answerData.contentType !== 'application/vnd.cotalker.survey+survey') {
      throw new Error(`☠️Answer.getSubAnswer: Identifier ${identifier} is not a survey+survey`)
    }
    if (!answerData.process?.length) return []
    const { uuids } = JSON.parse(answerData.process[0])
    const wait = ((uuids.length > 1) && Math.min(waitTime ?? 100, 100)) || 0
    const subAnswers = []
    for (const uuid of uuids) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      await new Promise(resolve => setTimeout(resolve, wait))
      subAnswers.push(await Answer.fromId(this.API, uuid))
    }
    return subAnswers
  }

  async getUser(): Promise<COTUser> {
    const user = await this.API.getUser(this.user)
    return user
  }
}
