import { sendMessageSqsEvents } from '../fixtures/events';
import { sendMessageHandler } from '../../lambdas/sendMessage';
import { TWILIO_PHONE_NUMBER } from '../../config/constants';

describe('startTopics()', () => {
    it('Success: returns 200 with valid event', async () => {
        const event = sendMessageSqsEvents.valid;
        const validNumber = '+12125678901';
        event.Records[0].body = JSON.stringify({
            to: validNumber,
            from: TWILIO_PHONE_NUMBER,
            text: 'test',
        });
        const result = await sendMessageHandler(event);
        expect(result.statusCode).toEqual(200);
    });
    it('Fails: returns 500 with invalid phone number', async () => {
        const event = sendMessageSqsEvents.valid;
        const invalidNumber = '+15005550001';
        event.Records[0].body = JSON.stringify({
            to: invalidNumber,
            from: TWILIO_PHONE_NUMBER,
            text: 'test',
        });
        const result = await sendMessageHandler(event);
        expect(result.statusCode).toEqual(500);
    });
    it('Fails: event records > 1', async () => {
        const event = sendMessageSqsEvents.valid;
        const invalidNumber = '+15005550001';
        event.Records[0].body = JSON.stringify({
            to: invalidNumber,
            from: TWILIO_PHONE_NUMBER,
            text: 'test',
        });
        event.Records.push(event.Records[0]);
        const result = await sendMessageHandler(event);
        expect(result.statusCode).toEqual(500);
    });
});
