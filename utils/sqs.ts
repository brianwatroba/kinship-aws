import { sqsClient } from '../config/clients';
import { SendMessageCommand } from '@aws-sdk/client-sqs';

export const sendSQSMessage = async (params: { queueUrl: string; payload: object }): Promise<string> => {
    const { queueUrl, payload } = params;
    const messageParams = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(payload),
    };

    const command = new SendMessageCommand(messageParams);

    const res = await sqsClient.send(command);

    if (!res) throw new Error('Failed to send sqs message');
    if (!res.MessageId) throw new Error('Failed to send sqs message: no message id');

    return res.MessageId;
};
