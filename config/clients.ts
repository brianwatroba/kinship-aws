import { AWS_CONFIG } from './constants';
import dynamoose from 'dynamoose';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { SQS } from '@aws-sdk/client-sqs';
import { Twilio } from 'twilio';
import { TWILIO_CONFIG } from '../config/constants';

// AWS
export const dbClientRaw = new DynamoDB(AWS_CONFIG);
export const dbClient = new dynamoose.aws.ddb.DynamoDB(AWS_CONFIG);
export const sqsClient = new SQS(AWS_CONFIG);

// Twilio
export const twilioClient = new Twilio(TWILIO_CONFIG.ACCOUNT_SID, TWILIO_CONFIG.AUTH_TOKEN);
