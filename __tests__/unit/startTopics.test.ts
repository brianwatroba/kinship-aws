import { startTopicsHandler } from '../../lambdas/startTopics';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dbClient, mockDbClient } from '../../config/clients';
import { startTopicsScheduledEvent } from '../fixtures/events';

describe('receiveMessage()', () => {
    beforeEach(() => {
        mockDbClient.reset();
    });

    const brian = {
        phoneNumber: '+15555555555',
        familyId: '87225257-6073-4937-b8c3-432a4e455f44',
    };

    const kevin = {
        phoneNumber: '+15555555556',
        familyId: '87225257-6073-4937-b8c3-432a4e455f44',
    };

    it('should return 200 when invoked by SINGLE SQS event', async () => {
        mockDbClient.on(ScanCommand).resolves({ Items: [brian, kevin] });
        const event = startTopicsScheduledEvent.valid;
        const result = await startTopicsHandler(event);
        expect(result.statusCode).toEqual(200);
        expect(true).toBe(true);
    });
});
