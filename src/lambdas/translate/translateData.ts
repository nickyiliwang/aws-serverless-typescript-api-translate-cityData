import "source-map-support/register";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import apiResponses from "../common/apiResponses";
import * as AWS from "aws-sdk";
// TS Interface for params
import { Translate } from "aws-sdk";

const translate = new AWS.Translate();

const translateData: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  // the event object coming in is an JSON object so we JSON.parse, but we don't need to do that because middy handles it
  const body = event.body;
  const { text, language } = body;

  if (!text) {
    return apiResponses._400({ message: "missing text from the body" });
  }

  if (!language) {
    return apiResponses._400({
      message: "missing language form the body",
    });
  }

  try {
    // we are getting this object interface from the aws-adk Translate, and it expects Text, SourceLangCode, and TargetLangCode
    const translateParams: Translate.Types.TranslateTextRequest = {
      Text: text,
      SourceLanguageCode: "en",
      TargetLanguageCode: language,
    };

    // most services needs .promise() to translate from callback to a promise
    const translatedMessage = await translate
      .translateText(translateParams)
      .promise();

    return apiResponses._200({
      translatedMessage,
    });
  } catch (error) {
    console.log("error in the translation", error);
    return apiResponses._400({ message: "unable to translate the message" });
  }
};

export const handler = middyfy(translateData);
