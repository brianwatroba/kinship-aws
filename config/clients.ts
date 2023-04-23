import { awsConfig, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from './constants';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SQS } from '@aws-sdk/client-sqs';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Twilio } from 'twilio';

// DyanmoDB
export const dbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
export const mockDbClient = mockClient(dbClient);

// SQS
export const sqsClient = new SQS(awsConfig);
export const mockSqsClient = mockClient(sqsClient);

// Twilio
export const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
