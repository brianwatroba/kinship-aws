import { APIGatewayProxyResult } from 'aws-lambda';
import { sendSQSMessage } from '../utils/sqs';
import { SQS_CONFIG } from '../config/constants';
import { Family } from '../models/Family';
import { ScheduledEvent } from 'aws-lambda';
import { generatePrompt } from '../utils/common';

export const triggerDailyTopicsHandler = async (event: ScheduledEvent): Promise<APIGatewayProxyResult> => {
    try {
        const allFamilies = await Family.scan().exec();
        const prompt = generatePrompt();
        const sentMessagesPromises = allFamilies.map((family: Record<string, string>) => {
            const payload = {
                familyId: family.id,
                prompt,
            };
            return sendSQSMessage({ queueUrl: SQS_CONFIG.URLS.START_TOPIC, payload });
        });

        await Promise.all(sentMessagesPromises);

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
