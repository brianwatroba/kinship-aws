import { APIGatewayProxyResult } from 'aws-lambda';
import { parseUrlEncoded } from '../utils/common';
import { TwilioWebhookEvent } from '../__tests__/fixtures/events';
import { SQS_CONFIG, CLIENT_CONFIG } from '../config/constants';
import { sendSQSMessage } from '../utils/sqs';
import { User } from '../models/User';
import { Topic } from '../models/Topic';
import { RESPONSES } from '../constants/responses';

export const receiveMessageHandler = async (event: TwilioWebhookEvent): Promise<APIGatewayProxyResult> => {
    try {
        // !TODO: verify message integrity

        const { body } = event;
        if (!body) throw new Error('No body in event');
        const parsedBody = parseUrlEncoded(body);
        const phoneNumber = `${parsedBody.From.replace(' ', '+')}`;
        const text = parsedBody.Body;
        const numMedia = Number(parsedBody.NumMedia);

        const user: any = await User.get(phoneNumber);
        const [topic] = await Topic.query('familyId').eq(user.familyId).sort('descending').limit(1).exec();

        if (topic.completed) {
            await sendSQSMessage({
                queueUrl: SQS_CONFIG.URLS.SEND_MESSAGE,
                payload: {
                    to: user.phoneNumber,
                    text: `Today's topic is completed! No more answers are being accepted.`,
                },
            });
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Success!`,
                }),
            };
        }

        const responseHasText = text !== '';
        const responseHasMedia = numMedia > 0;

        if (responseHasText) {
            const textResponse = {
                user: user.id,
                text,
            };
            topic.responses.push(textResponse);
        }

        if (responseHasMedia) {
            for (let i = 0; i < numMedia; i++) {
                const mediaUrl = `MediaUrl${i}`;
                const mediaResponse = {
                    user: user.id,
                    media: parsedBody[mediaUrl],
                };
                topic.responses.push(mediaResponse);
            }
        }

        const hasAnsweredAlready = topic.whoHasAnswered.includes(user.id);
        if (!hasAnsweredAlready) topic.whoHasAnswered.push(user.id);
        const allAnswered = topic.whoHasAnswered.length === topic.participants.length;
        if (allAnswered) topic.completed = true;
        await topic.save();

        const answeredProportion = `${topic.whoHasAnswered.length}/${topic.participants.length} 👪`;

        // confirm message
        await sendSQSMessage({
            queueUrl: SQS_CONFIG.URLS.SEND_MESSAGE,
            payload: {
                to: user.phoneNumber,
                text: `${RESPONSES.SAVED} | ${answeredProportion}`,
            },
        });

        if (allAnswered) {
            const familyMembers = await User.query({ familyId: { eq: user.familyId } }).exec();

            const summaryLink = `${CLIENT_CONFIG.URLS.TOPIC_ID}${topic.id}`;

            const sendMessagePromises = familyMembers.map((user: Record<string, string>) => {
                console.log('inside loop, user', user);
                const payload = {
                    to: user.phoneNumber,
                    text: `Answers are in! Today's summary: ${summaryLink}`,
                };
                return sendSQSMessage({ queueUrl: SQS_CONFIG.URLS.SEND_MESSAGE, payload });
            });

            await Promise.all(sendMessagePromises);
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
