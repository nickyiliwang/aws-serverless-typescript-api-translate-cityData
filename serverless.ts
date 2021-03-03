import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "aws-typescript-api",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    profile: "nickyiliwang",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["translate:*"],
        Resource: "*",
      },
    ],
    lambdaHashingVersion: "20201221",
  },
  functions: {
    getCityInfo: {
      handler: "src/lambdas/cityData/getCityInfo.handler",
      events: [
        {
          http: {
            path: "get-city/{city}",
            method: "get",
            cors: true,
          },
        },
      ],
    },
    translate: {
      handler: "src/lambdas/translate/translateData.handler",
      events: [
        {
          http: {
            path: "translate",
            method: "POST",
            cors: true,
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
