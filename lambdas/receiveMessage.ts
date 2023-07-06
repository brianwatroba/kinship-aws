import { APIGatewayProxyResult } from 'aws-lambda';
import { TwilioWebhookEvent } from '../__tests__/fixtures/events';
import { SQS_CONFIG, CLIENT_CONFIG } from '../config/constants';
import { sendSQSMessage } from '../utils/sqs';
import { parseUrlEncoded } from '../utils/common';
import { validateTwilioRequest } from '../utils/twilio';
import { User, Topic } from '../models/index';
import { RESPONSES } from '../constants/responses';

export const receiveMessageHandler = async (event: TwilioWebhookEvent): Promise<APIGatewayProxyResult> => {
    try {
        validateTwilioRequest(event);
        const { phoneNumber, text, media } = parseWebhookBody(event);

        const user = await User.get(phoneNumber);
        const topic = await Topic.getLatest(user.familyId);

        // TODO: validate there is an active topic

        topic.responses.push(formatResponses(user.id, text, media));

        topic.whoHasAnswered.add(user.id);
        const wasAlreadyCompleted = topic.completed;
        const nowCompleted = topic.whoHasAnswered.size === topic.participants.size;
        topic.completed = nowCompleted;

        await topic.save();

        // TODO: fire off with delay of 5 mins

        if (!wasAlreadyCompleted && nowCompleted) await sendTopicSummary(topic.id, user.familyId);

        await sendSQSMessage({
            queueUrl: SQS_CONFIG.URLS.SEND_MESSAGE,
            payload: {
                to: user.phoneNumber,
                text: `${RESPONSES.SAVED} | ${topic.whoHasAnswered.length}/${topic.participants.length} 👪`,
            },
        });

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

const formatResponses = (userId: string, text: string, media: string[]) => {
    const responses = [];
    if (text !== '')
        responses.push({
            user: userId,
            text,
        });

    media.forEach((item: string) => responses.push({ user: userId, media: item }));

    return responses;
};

const sendTopicSummary = async (topicId: string, familyId: string) => {
    const familyMembers = await User.getAllByFamily(familyId);

    const summaryLink = `${CLIENT_CONFIG.URLS.TOPIC_ID}${topicId}`;

    const sendMessagePromises = familyMembers.map((user: Record<string, string>) => {
        const delay = 120;
        const payload = {
            to: user.phoneNumber,
            text: `Answers are in! Today's summary: ${summaryLink}`,
        };
        return sendSQSMessage({ queueUrl: SQS_CONFIG.URLS.SEND_MESSAGE, payload, delay });
    });

    await Promise.all(sendMessagePromises);
};

export const parseWebhookBody = (event: TwilioWebhookEvent) => {
    if (!event.body) throw new Error('No body in event');
    const parsedEventBody = parseUrlEncoded(event.body);
    const phoneNumber = `${parsedEventBody.From.replace(' ', '+')}`;
    const text = parsedEventBody.Body;
    const numMedia = Number(parsedEventBody.numMedia);
    const media = [];
    for (let i = 0; i < numMedia; i++) {
        const mediaUrl = `MediaUrl${i}`;
        media.push(parsedEventBody[mediaUrl]);
    }
    return { phoneNumber, text, media };
};
