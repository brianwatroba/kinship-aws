import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Topic } from '../models/Topic';
import { Family } from '../models/Family';
import { User } from '../models/User';

export const renderSummaryHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // get topic
    // if not complete, render a not complete page
    // if complete, render summary
    try {
        console.log(event);
        const { pathParameters } = event;
        if (pathParameters === null || pathParameters === undefined) throw new Error('No path parameters');
        const { topicId } = pathParameters;
        if (topicId === null || topicId === undefined) throw new Error('No topicId');

        const [topic] = await Topic.scan('id').eq(topicId).exec();
        const familyMembers = await User.query('familyId').eq(topic.familyId).exec();
        const family = await Family.get(familyMembers[0].familyId);

        const userIdsToNames: any = {};

        familyMembers.forEach((user) => (userIdsToNames[user.id] = user.name));

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Success!`,
            }),
        };
    } catch (err: any) {
        console.log(err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err.message,
            }),
        };
    }
};
