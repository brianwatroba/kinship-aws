import { TWILIO_CONFIG } from '../config/constants';
import * as Twilio from 'twilio';
import { parseUrlEncoded } from './common';
import { APIGatewayProxyEvent } from 'aws-lambda';

type TwilioWebhookEvent = APIGatewayProxyEvent & { headers: { 'X-Twilio-Signature': string } };

export const validateTwilioRequest = (event: TwilioWebhookEvent): void => {
    if (!('body' in event)) throw new Error('No body in event');
    if (event.body === null) throw new Error('Body is null');

    const params = parseUrlEncoded(event.body);
    const signature = event.headers['X-Twilio-Signature'];
    const isValid = Twilio.validateRequest(TWILIO_CONFIG.AUTH_TOKEN, signature, TWILIO_CONFIG.URLS.WEBHOOK, params);

    if (!isValid) throw new Error('Invalid Twilio webhook signature');
};
