import { awsConfig } from './constants';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SQS } from '@aws-sdk/client-sqs';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// DyanmoDB
export const dbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
export const mockDbClient = mockClient(DynamoDBDocumentClient.from(new DynamoDBClient({})));

// SQS
export const sqsClient = new SQS(awsConfig);
