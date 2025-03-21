import { COTAnswer, COTAnswerData } from "@customTypes/COTTypes/COTAnswer";
import { COTProperty } from "@customTypes/COTTypes/COTProperty";
import { COTUser } from "@customTypes/COTTypes/COTUser";
import { ObjectId } from "@customTypes/custom";

import { cotalkerAPI } from "./CotalkerAPI";

export const answersAPI = {
	getAnswer: async (answerId: ObjectId): Promise<COTAnswer> => {
		return cotalkerAPI.getAnswer(answerId);
	},

	getUser: async (userId: ObjectId): Promise<COTUser> => {
		return cotalkerAPI.getUser(userId);
	}
};

export class Answer {
	public createdAt: Date;

	public user: ObjectId;

	private cotAnswer: COTAnswer;

	private constructor(cotAnswer: COTAnswer) {
		this.cotAnswer = cotAnswer;
		this.user = cotAnswer.user;
		this.createdAt = new Date(cotAnswer.createdAt);
	}

	static async fromId(answerId: ObjectId): Promise<Answer> {
		const cotAnswer = await answersAPI.getAnswer(answerId);
		return new Answer(cotAnswer);
	}

	getString(identifier: string): string {
		return this.getIdentifier(identifier)?.process?.[0] ?? "";
	}

	getNumber(identifier: string): number {
		return parseFloat(
			this.getIdentifier(identifier)?.process?.[0] ?? "NaN"
		);
	}

	getProcess(identifier: string): string[] {
		return this.getIdentifier(identifier)?.process ?? [];
	}

	getPropertyResponse<T extends COTProperty>(identifier: string): T | null {
		try {
			const response = this.getIdentifier(identifier)?.responses?.[0];
			return response ? JSON.parse(response) : null;
		} catch (error) {
			console.error("Error parsing property response:", error);
			return null;
		}
	}

	getIdentifier(identifier: string): COTAnswerData | undefined {
		return this.cotAnswer.data.find((d) => d.identifier === identifier);
	}

	async getSubAnswers(
		identifier: string,
		waitTime: number = 100
	): Promise<Answer[]> {
		const answerData = this.getIdentifier(identifier);

		if (
			!answerData ||
			answerData.contentType !== "application/vnd.cotalker.survey+survey"
		) {
			throw new Error(`Invalid sub-answer identifier: ${identifier}`);
		}

		if (!answerData.process?.length) return [];

		const { uuids } = JSON.parse(answerData.process[0]);

		return Promise.all(
			uuids.map(
				(uuid) =>
					new Promise<Answer>((resolve) =>
						setTimeout(
							async () => resolve(await Answer.fromId(uuid)),
							waitTime
						)
					)
			)
		);
	}

	async getUser(): Promise<COTUser> {
		return answersAPI.getUser(this.user);
	}
}
