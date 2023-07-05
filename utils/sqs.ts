import { sqsClient } from '../config/clients';
import { SendMessageCommand } from '@aws-sdk/client-sqs';

export const sendSQSMessage = async (params: {
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
