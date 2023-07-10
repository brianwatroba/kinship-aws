import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { ScheduledEvent } from 'aws-lambda';
import { getAllFamilies } from '../../services/familyService';
import { startTopic } from '../../services/topicService';

export const startTopicsHandler = async (event: ScheduledEvent): Promise<APIGatewayProxyResult> => {
    try {
        const families = await getAllFamilies();
        const promises = families.map((family) => {
            return startTopic({ familyId: family.id });
        });

        await Promise.all(promises);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Success: ${families.length} topics created and sent`,
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
