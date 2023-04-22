import { sqsClient } from '../config/clients';
import { SendMessageCommand } from '@aws-sdk/client-sqs';

export const sendMessage = async (params: { queueUrl: string; payload: object }): Promise<string> => {
    const { queueUrl, payload } = params;
    const messageParams = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(payload),
    };
    const command = new SendMessageCommand(messageParams);

    const res = await sqsClient.send(command);

    if (!res.MessageId) throw new Error('Failed to send message');

    return res.MessageId;
};
