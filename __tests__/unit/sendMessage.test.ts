import { sqsEvent } from '../fixtures/events';
import { sendMessageHandler } from '../../lambdas/sendMessage';
import { expect, describe, it } from '@jest/globals';

describe('SQS event tests', () => {
    it('should return a status code of 200 when invoked by SQS', async () => {
        const mockEvent = sqsEvent;

        const result = await sendMessageHandler(mockEvent);
        expect(result.statusCode).toEqual(200);
    });
});
