import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { sendMessage } from '../utils/sqs';
import { SQS_SEND_MESSAGE_QUEUE_URL, TWILIO_PHONE_NUMBER } from '../config/constants';
import { User } from '../models/User';
import { Topic } from '../models/Topic';

export const startTopicHandler = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (event.Records.length > 1) throw new Error('Too many records in SQS event! Should only be one');

        const record = event.Records[0];
        const { familyId, prompt } = JSON.parse(record.body);

        const familyMembers = await User.query({ familyId: { eq: familyId } }).exec();
        if (familyMembers.length < 1) throw new Error('No familyMembers found in family');

        const answeredBy = familyMembers.reduce((obj, user) => {
            obj[user.id] = false;
            return obj;
        }, {} as { [key: string]: boolean });

        console.log('answered', answeredBy);

        const topic = await Topic.create({
            familyId,
            prompt,
            answeredBy,
        });

        const promises = familyMembers.map((user: Record<string, string>) => {
            const payload = {
                to: user.phoneNumber,
                from: TWILIO_PHONE_NUMBER,
                text: prompt,
            };
            return sendMessage({ queueUrl: SQS_SEND_MESSAGE_QUEUE_URL, payload });
        });

        await Promise.all(promises);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Success: ${topic} messages sent`,
            }),
        };
    } catch (err: any) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err.message,
            }),
        };
    }
};
