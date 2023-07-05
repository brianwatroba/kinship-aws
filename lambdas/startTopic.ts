import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { sendSQSMessage } from '../utils/sqs';
import { SQS_CONFIG } from '../config/constants';
import { User, Topic } from '../models/index';

export const startTopicHandler = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (event.Records.length > SQS_CONFIG.MAX_MESSAGE_SIZE)
            throw new Error('Too many records in SQS event! Should only be one');

        const [record] = event.Records;
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
            return sendSQSMessage({ queueUrl: SQS_CONFIG.URLS.SEND_MESSAGE, payload });
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
