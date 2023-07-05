import { sendMessageSqsEvents } from '../fixtures/events';
import { sendMessageHandler } from '../../lambdas/sendMessage';

describe('sendMessage()', () => {
    it('Success: returns 200 with valid event', async () => {
        const event = sendMessageSqsEvents.valid;
        const result = await sendMessageHandler(event);
        expect(result.statusCode).toEqual(200);
    });
    it('Fails: returns 500 with invalid phone number', async () => {
        const event = sendMessageSqsEvents.invalid;
        const result = await sendMessageHandler(event);
        expect(result.statusCode).toEqual(500);
    });
    it('Fails: event records > 1', async () => {
        const event = sendMessageSqsEvents.tooManyRecords;
        const result = await sendMessageHandler(event);
        expect(result.statusCode).toEqual(500);
    });
});
