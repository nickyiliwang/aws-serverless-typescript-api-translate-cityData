import "source-map-support/register";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
// import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import { cityData } from "./cityData";

// const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
const getCityInfo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  // using the "?" flag we can return null if pathParameters is empty
  const city = event.pathParameters?.city;

  if (!city || !cityData[city]) {
    return apiResponses._400({
      message: "missing city or no data for that city",
    });
  }

  return apiResponses._200(cityData[city]);

  //   return formatJSONResponse({
  //     message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
  //     event,
  //   });
};

const apiResponses = {
  _200: (body: { [key: string]: any }) => {
    return {
      statusCode: 200,
      body: JSON.stringify(body, null, 2),
    };
  },
  _400: (body: { [key: string]: any }) => {
    return {
      statusCode: 400,
      body: JSON.stringify(body, null, 2),
    };
  },
};

export const handler = middyfy(getCityInfo);
