import { startTopicsHandler } from '../../lambdas/startTopics';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { mockSqsClient, mockDbClient } from '../../config/clients';
import { startTopicsScheduledEvent } from '../fixtures/events';
import { users } from '../fixtures/data';
import { User } from '../../models/User';

describe('startTopics()', () => {
    beforeEach(() => {
        mockDbClient.reset();
        mockSqsClient.reset();
    });

    it('should return 200 when invoked', async () => {
        const { brian, kevin, mark, kim } = users;
        const mockUsers = [brian, kevin, mark, kim];

        // const scanSpy = jest.spyOn(User, 'scan').mockReturnThis();
        // const execSpy = jest.spyOn(User, 'exec').mockResolvedValueOnce(mockUsers);

        const scanSpy = jest.spyOn(User, 'scan');
        scanSpy.mockReturnValueOnce({
            exec: jest.fn().mockResolvedValueOnce(mockUsers),
        } as any);

        mockSqsClient.on(SendMessageCommand).resolves({ MessageId: '123' });
        const event = startTopicsScheduledEvent.valid;
        const result = await startTopicsHandler(event);
        console.log('result', result);
        expect(result.statusCode).toEqual(200);
        expect(true).toBe(true);
    });
});
