import { InputSurveyApiFunctions } from "@customTypes/COTTypes/APISurvey";
import { SurveyApiAbstract } from "@models/SurveyApiAbstarct";
import { formatVariableInput, returnFormatFunctionOptions } from "@utils/utils";

export default class SurveyApiFilterOs extends SurveyApiAbstract {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(getterFunctions, filterFunctions) {
		super(getterFunctions, filterFunctions);
	}

	async getRawData<T>(
		getterParameters: InputSurveyApiFunctions[]
	): Promise<T[]> {
		const massiveGetter = getterParameters.find((e) => e.order === 1);
		const args = formatVariableInput(massiveGetter.parameters);
		const data = await this.getterFunction[massiveGetter.function](...args);
		return data as T[];
	}

	async filterData<T>(
		raw: T[],
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_filterParameters: InputSurveyApiFunctions[] = null
	): Promise<T[]> {
		return raw.map(returnFormatFunctionOptions["property-reduced"]) as T[];
	}

	async returnData<T>(
		getterParams: InputSurveyApiFunctions[],
		filterParams: InputSurveyApiFunctions[]
	): Promise<T[]> {
		const raw = await this.getRawData<T>(getterParams);
		return this.filterData<T>(raw, filterParams);
	}
}
