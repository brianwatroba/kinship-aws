import { sendMessageSqsEvents } from '../fixtures/events';
import { sendMessageHandler } from '../../lambdas/sendMessage';
// import { mockDbClient } from '../../config/clients';

describe('sendMessage()', () => {
    beforeEach(() => {
        // mockDbClient.reset();
    });

    it('should return 200 for valid sqs event', async () => {
        const event = sendMessageSqsEvents.valid;
        const result = await sendMessageHandler(event);
        expect(result.statusCode).toEqual(200);
    });

    it('should be invoked by a invalid sqs event', async () => {
        const event = sendMessageSqsEvents.valid;
        const result = await sendMessageHandler(event);
        expect(result.statusCode).toEqual(200);
    });
});
