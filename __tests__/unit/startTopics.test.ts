import { startTopicsHandler } from '../../lambdas/startTopics';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { mockSqsClient, mockDbClient } from '../../config/clients';
import { startTopicsScheduledEvent } from '../fixtures/events';

describe('receiveMessage()', () => {
    beforeEach(() => {
        mockDbClient.reset();
        mockSqsClient.reset();
    });

    const brian = {
        phoneNumber: '+18103330792',
        familyId: '87225257-6073-4937-b8c3-432a4e455f44',
    };

    // const kevin = {
    //     phoneNumber: '+15555555556',
    //     familyId: '87225257-6073-4937-b8c3-432a4e455f44',
    // };

    it('should return 200 when invoked', async () => {
        mockDbClient.on(ScanCommand).resolves({ Items: [brian] });
        mockSqsClient.on(SendMessageCommand).resolves({});
        const event = startTopicsScheduledEvent.valid;
        const result = await startTopicsHandler(event);
        console.log('result', result);
        expect(result.statusCode).toEqual(200);
        expect(true).toBe(true);
    });
});
