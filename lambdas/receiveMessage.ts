import { APIGatewayProxyResult } from 'aws-lambda';
import { parseUrlEncoded } from '../utils/common';
import { TwilioWebhookEvent } from '../__tests__/fixtures/events';
import { SQS_SEND_MESSAGE_QUEUE_URL } from '../config/constants';
import { sendMessage } from '../utils/sqs';
import { User } from '../models/User';
import { Topic } from '../models/Topic';
import { Family } from '../models/Family';
import { STANDARD_RESPONSES } from '../config/constants';

export const receiveMessageHandler = async (event: TwilioWebhookEvent): Promise<APIGatewayProxyResult> => {
    try {
        // verify message integrity

        const { body } = event;
        if (body === null || body === undefined) throw new Error('No body in event');
        const parsedBody = parseUrlEncoded(body);
        const phoneNumber = `${parsedBody.From.replace(' ', '+')}`;
        const text = parsedBody.Body;

        const user: any = await User.get(phoneNumber);
        const [topic] = await Topic.query('familyId').eq(user.familyId).sort('descending').limit(1).exec();

        const topicResponse = {
            user: user.id,
            text,
        };

        topic.responses.push(topicResponse);
        const hasAnsweredAlready = topic.whoHasAnswered.includes(user.id);
        if (!hasAnsweredAlready) topic.whoHasAnswered.push(user.id);
        const allAnswered = topic.whoHasAnswered.length === topic.participants.length;
        if (allAnswered) topic.completed = true;
        await topic.save();

        const confirmMessage = await sendMessage({
            queueUrl: SQS_SEND_MESSAGE_QUEUE_URL,
            payload: {
                to: user.phoneNumber,
                text: STANDARD_RESPONSES.RESPONSE_SAVED,
            },
        });

        if (allAnswered) {
            const familyMembers = await User.query({ familyId: { eq: user.familyId } }).exec();

            const promises = familyMembers.map((user: Record<string, string>) => {
                const payload = {
                    to: user.phoneNumber,
                    text: `Everyone has answered the question! Check out your summary: https://w2mrwgygx5.execute-api.us-east-1.amazonaws.com/Prod/renderSummary/${topic.id}`,
                };
                return sendMessage({ queueUrl: SQS_SEND_MESSAGE_QUEUE_URL, payload });
            });

            await Promise.all(promises);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Success!`,
            }),
        };
    } catch (err: any) {
        console.log(err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err.message,
            }),
        };
    }
};
