import { SQSEvent } from 'aws-lambda';
import { VALID_FROM_PHONE_NUMBER } from './constants';

export const sendMessageSqsEvents: { [key: string]: SQSEvent } = {
    valid: {
        Records: [
            {
                messageId: '12345',
                receiptHandle: 'abcde',
                body: JSON.stringify({ to: '+18105556666', text: 'hello world', from: VALID_FROM_PHONE_NUMBER }),
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
    },
};
