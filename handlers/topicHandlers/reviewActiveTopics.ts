import { APIGatewayProxyResult } from 'aws-lambda';
import { ScheduledEvent } from 'aws-lambda';
import { getAllFamilies } from '../../services/familyService';
import { getAllUsersByFamily } from '../../services/userService';
import { getActiveTopic } from '../../services/topicService';
import { sendManySms } from '../../services/smsService';
import { RESPONSES } from '../../constants/responses';

export const reviewActiveTopicsHandler = async (event: ScheduledEvent): Promise<APIGatewayProxyResult> => {
    try {
        const allFamilies = await getAllFamilies();

        for (const family of allFamilies) {
            const activeTopic = await getActiveTopic({ familyId: family.id });
            if (!activeTopic || activeTopic.isCompleted) continue;

            const familyMembers = await getAllUsersByFamily({ familyId: family.id });

            const { participants, whoHasAnswered, whoHasNotAnswered } = activeTopic;

            const usersToRemind = familyMembers.filter((user) => whoHasNotAnswered.includes(user.id));
            const reminderMsg = RESPONSES.REMINDER({
                responded: whoHasAnswered.length,
                total: participants.length,
                prompt: activeTopic.prompt,
            });
            const smsToSend = usersToRemind.map((user) => ({ to: user.phoneNumber, body: reminderMsg }));

            await sendManySms(smsToSend);
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
