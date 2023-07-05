import { APIGatewayProxyResult } from 'aws-lambda';
import { TwilioWebhookEvent } from '../__tests__/fixtures/events';
import { SQS_CONFIG, CLIENT_CONFIG } from '../config/constants';
import { sendSQSMessage } from '../utils/sqs';
import { parseTwilioWebhook } from '../utils/twilio';
import { User } from '../models/User';
import { Topic } from '../models/Topic';
import { RESPONSES } from '../constants/responses';
import { AnyItem } from 'dynamoose/dist/Item';

export const receiveMessageHandler = async (event: TwilioWebhookEvent): Promise<APIGatewayProxyResult> => {
    try {
        const formatResponses = (parsedBody: any, user: any) => {
            const responses = [];
            const responseHasText = text !== '';
            const responseHasMedia = numMedia > 0;
            if (responseHasText) {
                const textResponse = {
                    user: user.id,
                    text,
                };
                responses.push(textResponse);
            }

            if (responseHasMedia) {
                for (let i = 0; i < numMedia; i++) {
                    const mediaUrl = `MediaUrl${i}`;
                    const mediaResponse = {
                        user: user.id,
                        media: parsedBody[mediaUrl],
                    };
                    responses.push(mediaResponse);
                }
            }

            return responses;
        };

        const sendTopicSummary = async (topicId: string, familyId: string) => {
            const familyMembers = await User.getAllByFamily(familyId);

            const summaryLink = `${CLIENT_CONFIG.URLS.TOPIC_ID}${topicId}`;

            const sendMessagePromises = familyMembers.map((user: Record<string, string>) => {
                const payload = {
                    to: user.phoneNumber,
                    text: `Answers are in! Today's summary: ${summaryLink}`,
                };
                return sendSQSMessage({ queueUrl: SQS_CONFIG.URLS.SEND_MESSAGE, payload });
            });

            await Promise.all(sendMessagePromises);
        };

        const { parsedBody, phoneNumber, text, numMedia } = parseTwilioWebhook(event);

        const user: AnyItem = await User.get(phoneNumber);
        const topic = await Topic.getActive(user.familyId);

        // TODO: validate there is an active topic

        topic.responses.push(...formatResponses(parsedBody, user));

        // TODO: make the below a set?
        const hasAnsweredAlready = topic.whoHasAnswered.includes(user.id);
        if (!hasAnsweredAlready) topic.whoHasAnswered.push(user.id);
        topic.completed = topic.whoHasAnswered.length === topic.participants.length;

        await topic.save();

        // confirm message
        await sendSQSMessage({
            queueUrl: SQS_CONFIG.URLS.SEND_MESSAGE,
            payload: {
                to: user.phoneNumber,
                text: `${RESPONSES.SAVED} | ${topic.whoHasAnswered.length}/${topic.participants.length} 👪`,
            },
        });

        // TODO: fire off with delay of 5 mins

        if (topic.completed) await sendTopicSummary(topic.id, user.familyId);

        // TODO: send correct response to Twilio to handle

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
