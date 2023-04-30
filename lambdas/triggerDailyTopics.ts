import { APIGatewayProxyResult } from 'aws-lambda';
import { sendMessage } from '../utils/sqs';
import { SQS_START_TOPIC_QUEUE_URL } from '../config/constants';
import { Family } from '../models/Family';
import { ScheduledEvent } from 'aws-lambda';
import { prompts } from '../config/constants';

const getRandomValueInRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const triggerDailyTopicsHandler = async (event: ScheduledEvent): Promise<APIGatewayProxyResult> => {
    try {
        const allFamilies = await Family.scan().exec();
        const randIndex = getRandomValueInRange(0, allFamilies.length - 1);
        const prompt = prompts[randIndex];

        const promises = allFamilies.map((family: Record<string, string>) => {
            const payload = {
                familyId: family.id,
                prompt,
            };
            return sendMessage({ queueUrl: SQS_START_TOPIC_QUEUE_URL, payload });
        });

        await Promise.all(promises);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Success!`,
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
