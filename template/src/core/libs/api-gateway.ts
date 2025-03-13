import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>, statusCode?: number) => {
  return {
    statusCode: statusCode ?? 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: response
  }
}

export const formatExcelResponse = (buffer: any, fileName: string, statusCode?: number) => {
  return {
    statusCode: statusCode ?? 200,
    isBase64Encoded: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=" + fileName,
      'Content-Length': buffer.length,
    },
    body: buffer.toString('base64')
  }  
}