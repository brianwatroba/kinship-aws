import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { sendMessage } from '../utils/sqs';
import { SQS_SEND_MESSAGE_QUEUE_URL } from '../config/constants';
import { User } from '../models/User';
import { Topic } from '../models/Topic';

export const startTopicHandler = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (event.Records.length > 1) throw new Error('Too many records in SQS event! Should only be one');

        const record = event.Records[0];
        const { familyId, prompt } = JSON.parse(record.body);

        const familyMembers = await User.query({ familyId: { eq: familyId } }).exec();
        if (familyMembers.length < 1) throw new Error('No familyMembers found in family');

        const topic = await Topic.create({
            familyId,
            prompt,
            participants: familyMembers.map((user) => user.id),
        });

        // TODO: add skip family members if paused
        const promises = familyMembers.map((user: Record<string, string>) => {
            const payload = {
                to: user.phoneNumber,
                text: prompt,
            };
            return sendMessage({ queueUrl: SQS_SEND_MESSAGE_QUEUE_URL, payload });
        });

        //TODO: handle partial failures? Batch insert?
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
