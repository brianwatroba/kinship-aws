import * as Twilio from 'twilio';
import { TWILIO_CONFIG } from '../config/constants';
import { parseUrlEncoded } from './common';
import { TwilioWebhookEvent } from '../types';

export const validateTwilioWebhookEvent = (event: TwilioWebhookEvent): void => {
    if (!('body' in event)) throw new Error('No body in event');
    if (event.body === null) throw new Error('Body is null');
    if (!('X-Twilio-Signature' in event.headers)) throw new Error('No Twilio signature in headers');

    const params = parseUrlEncoded(event.body);
    const signature = event.headers['X-Twilio-Signature'];
    const isValid = Twilio.validateRequest(TWILIO_CONFIG.AUTH_TOKEN, signature, TWILIO_CONFIG.URLS.WEBHOOK, params);

    if (!isValid) throw new Error('Invalid Twilio webhook signature');
};

export const parseTwilioWebhookEventBody = (event: TwilioWebhookEvent) => {
    if (!event.body) throw new Error('No body in event');
    const parsedEventBody = parseUrlEncoded(event.body);
    const from = `${parsedEventBody.From.replace(' ', '+')}`;
    const text = parsedEventBody.Body === '' ? undefined : parsedEventBody.Body;
    const numMedia = Number(parsedEventBody.numMedia);
    const media = [];
    for (let i = 0; i < numMedia; i++) {
        const mediaUrl = `MediaUrl${i}`;
        media.push(parsedEventBody[mediaUrl]);
    }
    return { from, text, media };
};
