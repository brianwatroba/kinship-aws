import { TWILIO_AUTH_TOKEN, TWILIO_WEBHOOK_URL } from '../config/constants';
import * as Twilio from 'twilio';
import { parseUrlEncoded } from './common';
import { APIGatewayProxyEvent } from 'aws-lambda';

type TwilioWebhookEvent = APIGatewayProxyEvent & { headers: { 'X-Twilio-Signature': string } };

export const validateTwilioRequest = (event: TwilioWebhookEvent) => {
    if (!('body' in event)) throw new Error('No body in event');
    if (event.body === null) throw new Error('Body is null');

    const params = parseUrlEncoded(event.body);
    console.log('params', params);
    const signature = event.headers['X-Twilio-Signature'];

    console.log('signature', signature);

    console.log;

    const isValid = Twilio.validateRequest(TWILIO_AUTH_TOKEN, signature, TWILIO_WEBHOOK_URL, params);

    console.log('isValid', isValid);

    return isValid;
};
