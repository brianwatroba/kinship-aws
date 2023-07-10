import { APIGatewayProxyEvent } from 'aws-lambda';
// Events
export type TwilioWebhookEvent = APIGatewayProxyEvent & { headers: { 'X-Twilio-Signature': string } };
