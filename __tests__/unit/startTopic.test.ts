import { startTopicHandler } from '../../lambdas/startTopic';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { mockSqsClient } from '../../config/clients';
import { startTopicSqsQueueEvents } from '../fixtures/events';
import { mockModelFunc } from '../fixtures/utils';
import { users } from '../fixtures/data';
import { User } from '../../models/User';
import { Topic } from '../../models/Topic';

const [brian, kevin] = users;
const family = [brian, kevin];
const familyId = family[0].familyId;
const prompt = 'test prompt';
const topic = {
    familyId,
    prompt,
    responsesLeft: family.length,
    createdAt: 1682338600185,
    updatedAt: 1682338600185,
};
const sendMessageResponse = { MessageId: '123' };

describe('startTopics()', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        mockSqsClient.reset();
        mockModelFunc(User, 'query', family);
        mockModelFunc(Topic, 'create', topic);
        mockSqsClient.on(SendMessageCommand).resolves(sendMessageResponse);
    });

    it('Success: returns 200 with valid event', async () => {
        const event = startTopicSqsQueueEvents.valid;
        event.Records[0].body = JSON.stringify({
            familyId,
            prompt,
        });

        const result = await startTopicHandler(event);
        expect(result.statusCode).toEqual(200);
    });
    it('Success: correct number of messages sent to SQS', async () => {
        const event = startTopicSqsQueueEvents.valid;
        event.Records[0].body = JSON.stringify({
            familyId,
            prompt,
        });

        const result = await startTopicHandler(event);
        const sendMessageCalls = mockSqsClient.commandCalls(SendMessageCommand);
        expect(result.statusCode).toEqual(200);
        expect(sendMessageCalls.length).toEqual(family.length);
    });
    it('Failure: records > 1', async () => {
        const event = startTopicSqsQueueEvents.valid;
        event.Records[0].body = JSON.stringify({
            familyId,
            prompt,
        });
        event.Records.push(event.Records[0]); // 2 records

        const result = await startTopicHandler(event);
        const sendMessageCalls = mockSqsClient.commandCalls(SendMessageCommand);
        expect(result.statusCode).toEqual(500);
        expect(sendMessageCalls.length).toEqual(0);
    });
    it('Failure: no members in family', async () => {
        const event = startTopicSqsQueueEvents.valid;
        event.Records[0].body = JSON.stringify({
            familyId,
            prompt,
        });

        jest.restoreAllMocks();
        mockModelFunc(User, 'query', []); // no family members

        const result = await startTopicHandler(event);
        const sendMessageCalls = mockSqsClient.commandCalls(SendMessageCommand);
        expect(result.statusCode).toEqual(500);
        expect(sendMessageCalls.length).toEqual(0);
    });
});
