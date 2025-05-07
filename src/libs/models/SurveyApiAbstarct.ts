import { InputSurveyApiFunctions } from "@customTypes/COTTypes/APISurvey";

export abstract class SurveyApiAbstract {
	protected filterFunction: Record<string, (...args: any[]) => any>;

	protected getterFunction: Record<string, (...args: any[]) => Promise<any>>;

	constructor(
		getterFunctions: Record<string, (...args: any[]) => Promise<any>>,
		filterFunctions: Record<string, (...args: any[]) => any>
	) {
		this.filterFunction = getterFunctions;
		this.getterFunction = filterFunctions;
	}

	abstract getRawData<T>(
		getterParameters: InputSurveyApiFunctions[]
	): Promise<T[]>;

	abstract filterData<T>(
		rawData: T[],
		filterParameters: InputSurveyApiFunctions[]
	): Promise<T[]>;

	abstract returnData<T>(
		getterParameters: InputSurveyApiFunctions[],
		filterParameters: InputSurveyApiFunctions[]
	): Promise<T[]>;
}
