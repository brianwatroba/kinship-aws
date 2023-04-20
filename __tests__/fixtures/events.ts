import { SQSEvent } from 'aws-lambda';

export const sqsEvent: SQSEvent = {
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
