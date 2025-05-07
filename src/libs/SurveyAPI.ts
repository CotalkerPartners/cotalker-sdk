import { InputSurveyApiFunctions } from "@customTypes/COTTypes/APISurvey";
import SurveyApiFilterOs from "@models/SURApiFunctionClient";

export class SurveyApi {
	private getterFunctions: Record<string, (...args: any[]) => Promise<any>> =
		{};

	private filterFunctions: Record<string, (...args: any[]) => any> = {};

	private getterParams: InputSurveyApiFunctions[] = [];

	private filterParams: InputSurveyApiFunctions[] = [];

	private _surveyApiFilterOs?: SurveyApiFilterOs;

	public getSurveyApiFilterOs(): SurveyApiFilterOs {
		if (!this._surveyApiFilterOs) {
			this._surveyApiFilterOs = new SurveyApiFilterOs(
				this.getterFunctions,
				this.filterFunctions
			);
		}
		return this._surveyApiFilterOs;
	}

	public selectGetterFunctions(
		...getterParams: InputSurveyApiFunctions[]
	): this {
		this.getterParams = getterParams;
		return this;
	}

	public selectFilterFunctions(
		...filterParams: InputSurveyApiFunctions[]
	): this {
		this.filterParams = filterParams;
		return this;
	}

	public registerGetterFunctions(
		fns: Record<string, (...args: any[]) => Promise<any>>
	): this {
		this.getterFunctions = { ...this.getterFunctions, ...fns };
		return this;
	}

	public registerFilterFunctions(
		fns: Record<string, (...args: any[]) => any>
	): this {
		this.filterFunctions = { ...this.filterFunctions, ...fns };
		return this;
	}

	public async run<T>(): Promise<T[]> {
		return this.getSurveyApiFilterOs().returnData<T>(
			this.getterParams,
			this.filterParams
		);
	}
}
