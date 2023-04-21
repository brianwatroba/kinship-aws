import { receiveMessageApiEvents } from '../fixtures/events';
import { receiveMessageHandler } from '../../lambdas/receiveMessage';

describe('SQS event tests', () => {
    it('should return 200 when invoked by SINGLE SQS event', async () => {
        const event = receiveMessageApiEvents.valid;
        const result = await receiveMessageHandler(event);
        expect(result.statusCode).toEqual(200);
        expect(true).toBe(true);
    });
});
