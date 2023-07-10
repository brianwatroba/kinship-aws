import { Topic } from '../models/index';
import { getAllUsersByFamily } from './userService';
import { RESPONSES } from '../constants/responses';
import { TWILIO_CONFIG, SQS_CONFIG, CLIENT_CONFIG } from '../config/constants';
import { sendSqsMessage } from '../utils/aws';

type SendSmsParams = {
    to: string;
    body?: string;
    mediaUrl?: string;
};

export const sendSms = async ({ to, body, mediaUrl }: SendSmsParams): Promise<string> => {
    const queueUrl = SQS_CONFIG.URLS.SEND_MESSAGE;
    const from = TWILIO_CONFIG.PHONE_NUMBERS.KINSHIP;
    const payload = {
        to,
        from,
        body,
        mediaUrl,
    };
    return sendSqsMessage({ queueUrl, payload });
};

export const sendManySms = async (params: SendSmsParams[]) => {
    const promises = params.map((param) => sendSms(param));
    return Promise.all(promises);
};

export const sendTopicSummary = async (params: { topicId: string }) => {
    const topic = await Topic.get(params.topicId);
    const familyMembers = await getAllUsersByFamily({ familyId: topic.familyId });

    const summaryLink = `${CLIENT_CONFIG.URLS.TOPIC_ID}${topic.id}`;

    const sendMessagePromises = familyMembers.map((user: Record<string, string>) => {
        const params = {
            to: user.phoneNumber,
            body: RESPONSES.SUMMARY({ summaryLink }),
            delay: 120,
        };
        return sendSms(params);
    });

    const res = await Promise.all(sendMessagePromises);
    if (res) await Topic.update({ id: topic.id }, { isSummarySent: true });
};
