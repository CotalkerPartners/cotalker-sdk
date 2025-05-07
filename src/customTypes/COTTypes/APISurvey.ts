// eslint-disable-next-line import/no-extraneous-dependencies
import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";

// eslint-disable-next-line @typescript-eslint/ban-types
export type FunctionDictionary = Record<string, Function>;
export type ParameterSurveyApiFunctions = {
	order: number;
	code: string;
	value: any;
};
export type InputSurveyApiFunctions = {
	order: number;
	function: string;
	parameters: ParameterSurveyApiFunctions[];
};

export interface SurveyApiQuery
	extends APIGatewayProxyEventQueryStringParameters {
	op: string;
	value_identifier: string;
	value: string;
	object_key: string;
}

export interface SurveyFilterByOSsApiQuery extends SurveyApiQuery {
	type_identifier: string;
}

export type WindowPageQuery = {
	start: number;
	end: number;
};
