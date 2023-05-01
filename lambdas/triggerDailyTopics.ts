import { APIGatewayProxyResult } from 'aws-lambda';
import { sendMessage } from '../utils/sqs';
import { SQS_START_TOPIC_QUEUE_URL } from '../config/constants';
import { Family } from '../models/Family';
import { ScheduledEvent } from 'aws-lambda';
import { prompts } from '../config/constants';
import dayjs from 'dayjs';

const getRandomValueInRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const triggerDailyTopicsHandler = async (event: ScheduledEvent): Promise<APIGatewayProxyResult> => {
    try {
        const allFamilies = await Family.scan().exec();

        const dayOfWeek = dayjs().day();
        if (dayOfWeek === 2 || dayOfWeek === 4) {
            // do nothing on Tuesday or Thursday
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Success!`,
                }),
            };
        }
        let promptsByDay;

        if (dayOfWeek === 0) {
            promptsByDay = prompts.heavy;
        } else if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
            promptsByDay = prompts.light;
        } else {
            promptsByDay = prompts.medium;
        }

        const randIndex = getRandomValueInRange(0, promptsByDay.length - 1);
        if (promptsByDay === undefined) throw new Error('No prompts for today');
        const prompt = promptsByDay[randIndex];

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
