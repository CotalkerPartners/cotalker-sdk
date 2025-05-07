import { WindowPageQuery } from "@customTypes/COTTypes/APISurvey";
import { COTProperty } from "@customTypes/COTTypes/COTProperty";
import { COTUser } from "@customTypes/COTTypes/COTUser";
// eslint-disable-next-line import/no-extraneous-dependencies
import get from "lodash.get";

type FilterCallBackFactory = (
	basePath: string,
	key: string,
	target_value: unknown
) => (c: any) => boolean;
type FilterCheckOperation =
	| "eq"
	| "neq"
	| "lte"
	| "gte"
	| "arraycontains"
	| "arraynotcontains"
	| "arraycontainsarray";
type MapReturnFunction = (c: any) => object;

export const cleanAndFormatUser = (displayEmail: boolean = true) => {
	return (
		user: COTUser
	): Partial<COTUser> & { code: string; display: string } => ({
		_id: user._id,
		name: user.name,
		email: user.email,
		accessRoles: user.accessRoles,
		code: user._id,
		properties: user.properties,
		display: displayEmail
			? `${user.name.names} ${user.name.lastName} <${user.email}>`
			: `${user.name.names} ${user.name.lastName}`
	});
};

export const filterSystemUser = (user) => {
	return !user.system || user.system === "admin";
};

export const returnFormatFunctionOptions: Record<string, MapReturnFunction> = {
	property: (p) => ({
		...p,
		_id: p._id,
		code: p._id,
		_code: p.name.code,
		display: p.name.display
	}),
	"property-reduced": (p) => ({
		_id: p._id,
		code: p._id,
		_code: p.name.code,
		display: p.name.display
	}),
	user: cleanAndFormatUser
};

const filterOperation = (
	elements: any[],
	object_key: string,
	basePath: string,
	targetValue: any,
	callbackFactory: FilterCallBackFactory,
	returnFormatFunction: MapReturnFunction
) => {
	const callback = callbackFactory(basePath, object_key, targetValue);
	return elements.filter(callback).map(returnFormatFunction);
};

const operationOptions: Record<FilterCheckOperation, FilterCallBackFactory> = {
	eq: (basePath: string, object_key: string, targetValue: unknown) => {
		return (element: any) => {
			return (
				String(get(element, basePath, undefined)?.[object_key]) ===
				String(targetValue)
			);
		};
	},
	neq: (basePath: string, object_key: string, targetValue: unknown) => {
		return (element: any) => {
			return (
				String(get(element, basePath, undefined)?.[object_key]) !==
				String(targetValue)
			);
		};
	},
	lte: (basePath: string, object_key: string, targetValue: unknown) => {
		return (element: any) => {
			return (
				Number(get(element, basePath, undefined)?.[object_key]) <=
				Number(targetValue)
			);
		};
	},
	gte: (basePath: string, object_key: string, targetValue: unknown) => {
		return (element: any) => {
			return (
				Number(get(element, basePath, undefined)?.[object_key]) >=
				Number(targetValue)
			);
		};
	},
	arraycontains: (
		basePath: string,
		object_key: string,
		targetValue: unknown
	) => {
		return (element: any) => {
			return (
				get(element, basePath, undefined)?.[object_key] as any[]
			).includes(targetValue);
		};
	},
	arraynotcontains: (
		basePath: string,
		object_key: string,
		targetValue: unknown
	) => {
		return (element: any) => {
			return !(
				get(element, basePath, undefined)?.[object_key] as any[]
			).includes(targetValue);
		};
	},
	arraycontainsarray: (
		basePath: string,
		object_key: string,
		targetValue: unknown[]
	) => {
		return (element: any) => {
			return targetValue.includes(
				get(element, basePath, undefined)?.[object_key] as any
			);
		};
	}
};

export const formatJSONResponse = (
	response: Record<string, unknown>,
	statusCode = 200
) => {
	return {
		statusCode,
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(response)
	};
};

export function filterElements(
	targetValue,
	op,
	object_key,
	targetElements,
	basePath,
	typeOfReturn
) {
	if (Array.isArray(targetValue) && op === "arraycontainsarray") {
		// eslint-disable-next-line no-param-reassign
		targetValue = targetValue.map((e) => JSON.parse(e)._id);
	}

	const operation = operationOptions[op || "eq"];
	const returnFormat =
		returnFormatFunctionOptions[typeOfReturn || "property"];
	const result = filterOperation(
		targetElements,
		object_key,
		basePath,
		targetValue,
		operation,
		returnFormat
	);
	return result;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum surveyApiFunctionsKind {
	// eslint-disable-next-line @typescript-eslint/no-shadow
	get,
	filter
}

export function formatVariableInput(array) {
	return array.sort((a, b) => a.order - b.order).map((param) => param.value);
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum surveyApiTypes {
	filterOSByStates,
	getClients
}

export enum TypesOfRutsOfClient {
	rut_cliente = "rut_cliente",
	rut_sin_contrato = "rut_sin_contrato"
}

export enum TypesOfClientPropertyType {
	rut_cliente = "rut_clientes",
	rut_sin_contrato = "rut_no_clientes"
}

async function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getPropertiesByWindow = async (
	propertyTypes: string[],
	page: WindowPageQuery,
	// eslint-disable-next-line @typescript-eslint/ban-types
	getPropertiesByPropertyTypesByPageFunction: Function,
	pageLength: number
) => {
	const promises = [];
	for (let i = page.start; i <= page.end; i++) {
		promises.push(
			getPropertiesByPropertyTypesByPageFunction(
				propertyTypes,
				i,
				pageLength
			)
		);
	}
	const result = await Promise.all(promises);
	const count = result?.[0]?.count || 0;
	const properties = result.reduce((accumulator, iterator) => {
		if (!iterator.properties) {
			return accumulator;
		} else {
			return accumulator.concat(iterator.properties);
		}
	}, []);
	return { count, properties };
};

export const getAllPropertiesFromPropertyTypes = async (
	// eslint-disable-next-line @typescript-eslint/ban-types
	getPropertiesByPropertyTypesByPageFunction: Function,
	propertyTypes: string[],
	windowSize: number,
	pageLength: number
): Promise<COTProperty[]> => {
	let pages = 0;
	const pagesWindow: WindowPageQuery = {
		start: 1,
		end: windowSize
	};

	let resultProperties = [];
	let window = 0;
	let maxNumberOfWindows = 0;

	do {
		const propertiesData = await getPropertiesByWindow(
			propertyTypes,
			pagesWindow,
			getPropertiesByPropertyTypesByPageFunction,
			pageLength
		);
		pages = Math.ceil(propertiesData.count / pageLength);
		maxNumberOfWindows = Math.ceil(pages / windowSize);
		resultProperties = resultProperties.concat(propertiesData.properties);
		window += 1;
		pagesWindow.start = pagesWindow.start + windowSize;
		pagesWindow.end =
			pagesWindow.end + windowSize < pages
				? pagesWindow.end + windowSize
				: pages;
		await delay(100);
	} while (maxNumberOfWindows > window);
	return resultProperties;
};

export function formatTargetValue(op, value, eventBody, value_identifier) {
	const target = value ?? eventBody.data[value_identifier]?.[0];

	if (op === "arraycontainsarray") {
		return eventBody.data[value_identifier];
	} else if (typeof target === "string" && target[0] === "{") {
		return JSON.parse(target)._id;
	} else {
		return target;
	}
}
