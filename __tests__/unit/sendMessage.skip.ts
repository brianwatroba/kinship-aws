import { sendMessageSqsEvents } from '../fixtures/events';
import { sendMessageHandler } from '../../lambdas/sendMessage';

describe('SQS event tests', () => {
    it('should return 200 when invoked by SINGLE SQS event', async () => {
        const event = sendMessageSqsEvents.valid;
        const result = await sendMessageHandler(event);
        expect(result.statusCode).toEqual(200);
    });
});
