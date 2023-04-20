import { SQSEvent } from 'aws-lambda';
import { sendMessageHandler } from '../../lambdas/sendMessage';
import { expect, describe, it } from '@jest/globals';

describe('SQS event tests', () => {
    it('should return a status code of 200 when invoked by SQS', async () => {
        // Mock SQS event
        const event: SQSEvent = {
            Records: [
                {
                    messageId: '12345',
                    receiptHandle: 'abcde',
                    body: JSON.stringify({ name: 'John Doe' }),
                    attributes: {
                        ApproximateReceiveCount: '1',
                        SentTimestamp: '123456789',
                        SenderId: '123456789',
                        ApproximateFirstReceiveTimestamp: '123456789',
                    },
                    messageAttributes: {},
                    md5OfBody: '',
                    eventSource: '',
                    eventSourceARN: '',
                    awsRegion: '',
                },
            ],
        };

        // Invoke Lambda function with mock event and context
        const result = await sendMessageHandler(event);

        // Assert that the status code is 200
        expect(result.statusCode).toEqual(200);
    });
});
