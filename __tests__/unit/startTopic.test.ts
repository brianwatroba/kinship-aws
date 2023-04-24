import { startTopicHandler } from '../../lambdas/startTopic';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { mockSqsClient } from '../../config/clients';
import { startTopicSqsQueueEvents } from '../fixtures/events';
import { users } from '../fixtures/data';
import { User } from '../../models/User';
import { Model } from 'dynamoose/dist/Model';

const mockModelFunc = (params: Model, func: string, output: any) => {
    const scanSpy = jest.spyOn(User, func);
    scanSpy.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(output),
    } as any);
};

describe('startTopics()', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        mockSqsClient.reset();
    });

    it('should return 200 when invoked with valid event', async () => {
        mockModelFunc(User, 'scan', users);
        mockSqsClient.on(SendMessageCommand).resolves({ MessageId: '123' });
        const event = startTopicSqsQueueEvents.valid;
        const result = await startTopicHandler(event);
        expect(result.statusCode).toEqual(200);
        expect(true).toBe(true);
    });
});
