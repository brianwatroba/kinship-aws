import { twilioWebhookEvents } from '../fixtures/events';
import { receiveMessageHandler } from '../../lambdas/receiveMessage';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqsClient } from '../../config/clients';
import { mockClient } from 'aws-sdk-client-mock';
import { mockModelFunc } from '../fixtures/utils';
import { users } from '../fixtures/data';
import { User } from '../../models/User';
import { Topic } from '../../models/Topic';

export const mockSqsClient = mockClient(sqsClient);

const [brian, kevin] = users;
const family = [brian, kevin];
const familyId = family[0].familyId;
const prompt = 'test prompt';
const topic = {
    familyId,
    prompt,
    responsesLeft: family.length,
    createdAt: Date.now(),
    updatedAt: Date.now(),
};
const receiveMessageResponse = { MessageId: '123' };

describe('receiveMessage()', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        mockSqsClient.reset();
        mockModelFunc(User, 'query', family);
        mockModelFunc(Topic, 'create', topic);
        mockSqsClient.on(SendMessageCommand).resolves(receiveMessageResponse);
    });
    it('Success: returns 200 with valid event', async () => {
        const event = twilioWebhookEvents.valid;
        const result = await receiveMessageHandler(event);
        console.log(result);
        expect(result.statusCode).toEqual(200);
    });
});

// failure
// user does not exist
// no active topic
// already answered
//
