import { twilioWebhookEvents } from '../fixtures/events';
import { receiveMessageHandler } from '../../lambdas/receiveMessage';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
// import { mockDbClient } from '../../config/clients';

describe('receiveMessage()', () => {
    // beforeEach(() => {
    //     // mockDbClient.reset();
    // });

    // const brian = {
    //     phoneNumber: '+15555555555',
    //     familyId: '87225257-6073-4937-b8c3-432a4e455f44',
    // };

    it('Success: logs', async () => {
        // mockDbClient.on(GetCommand).resolves({ Item: brian });
        const event = twilioWebhookEvents.valid;
        const result = await receiveMessageHandler(event);
        expect(result.statusCode).toEqual(200);
        expect(true).toBe(true);
    });
});
