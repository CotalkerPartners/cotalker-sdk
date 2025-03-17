import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import type { AWS } from "@serverless/typescript";

export const middyfy = handler => {
	return middy(handler).use(middyJsonBodyParser());
};

// AWSFunction type
export type AWSFunction = AWS["functions"][0];
