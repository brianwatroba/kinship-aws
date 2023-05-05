import { APIGatewayProxyResult } from 'aws-lambda';
import { sendMessage } from '../utils/sqs';
import { SQS_SEND_MESSAGE_QUEUE_URL } from '../config/constants';
import { Family } from '../models/Family';
import { Topic } from '../models/Topic';
import { User } from '../models/User';
import { ScheduledEvent } from 'aws-lambda';

export const triggerTopicReminderHandler = async (event: ScheduledEvent): Promise<APIGatewayProxyResult> => {
    try {
        const allFamilies = await Family.scan().exec();

        for (const family of allFamilies) {
            const [topic] = await Topic.query('familyId').eq(family.familyId).sort('descending').limit(1).exec();
            if (topic.completed) continue;

            const familyMembers = await User.query({ familyId: { eq: family.id } }).exec();
            if (familyMembers.length < 1) throw new Error('No familyMembers found in family');

            const hasNotAnsweredIds = topic.participants.filter(
                (userId: string) => !topic.whoHasAnswered.includes(userId),
            );

            const hasNotAnswered = familyMembers.filter((user: Record<string, string>) =>
                hasNotAnsweredIds.includes(user.id),
            );

            if (hasNotAnswered.length === 0) continue;

            const answeredProportion = `${topic.whoHasAnswered.length}/${topic.participants.length} 👪`;

            const promises = hasNotAnswered.map((user: Record<string, string>) => {
                return sendMessage({
                    queueUrl: SQS_SEND_MESSAGE_QUEUE_URL,
                    payload: {
                        to: user.phoneNumber,
                        text: `Your fam is waiting for your answer! | ${answeredProportion} have answered.\n\nPrompt:${topic.prompt}`,
                    },
                });
            });

            await Promise.all(promises);
        }

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
