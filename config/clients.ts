import { awsConfig, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from './constants';
import dynamoose from 'dynamoose';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { SQS } from '@aws-sdk/client-sqs';
import { mockClient } from 'aws-sdk-client-mock';
// import { Twilio } from 'twilio';

// DyanmoDB
export const dbClientRaw = new DynamoDB(awsConfig);
// export const dbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
export const dbClient = new dynamoose.aws.ddb.DynamoDB(awsConfig);

export const mockDbClient = mockClient(dbClientRaw);

// SQS
export const sqsClient = new SQS(awsConfig);
export const mockSqsClient = mockClient(sqsClient);

// Twilio
// export const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
