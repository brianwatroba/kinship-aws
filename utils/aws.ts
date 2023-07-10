import { sqsClient } from '../config/clients';
import { SQS_CONFIG } from '../config/constants';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { SQSEvent } from 'aws-lambda';

// SQS

export const validateSqsEvent = (event: SQSEvent) => {
    if (!('Records' in event)) throw new Error('Sqs event does not have Records property');
    const recordsCount = event.Records.length;
    const maxRecords = SQS_CONFIG.MAX_MESSAGE_SIZE;
    if (recordsCount > maxRecords)
        throw new Error(`Too many records in SQS event! Received ${recordsCount}, max is ${maxRecords}`);
};

export const parseSqsEventBody = (event: SQSEvent) => {
    return event.Records.map((record) => JSON.parse(record.body));
};

export const sendSqsMessage = async (params: {
    queueUrl: string;
    payload: object;
    delay?: number;
}): Promise<string> => {
    const { queueUrl, payload, delay } = params;
    const messageParams = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(payload),
        DelaySeconds: delay,
    };

    const command = new SendMessageCommand(messageParams);

    const res = await sqsClient.send(command);

    if (!res) throw new Error('Failed to send sqs message');
    if (!res.MessageId) throw new Error('Failed to send sqs message: no message id');

    return res.MessageId;
};
