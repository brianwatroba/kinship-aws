import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Topic } from '../models/Topic';
import { Family } from '../models/Family';
import { User } from '../models/User';

export const getTopicSummaryHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { pathParameters } = event;
        if (pathParameters === null || pathParameters === undefined) throw new Error('No path parameters');

        const { topicId } = pathParameters;
        if (topicId === null || topicId === undefined) throw new Error('No topicId');

        const [topic] = await Topic.scan('id').eq(topicId).exec();
        if (topic === undefined) throw new Error('Topic not found');

        const familyMembers = await User.query('familyId').eq(topic.familyId).exec();
        const family = await Family.get(familyMembers[0].familyId);

        const usersResponses = familyMembers.reduce((acc: any, user: any) => {
            acc[user.id] = {
                name: user.firstName,
                image: user.image,
                responses: [],
            };
            return acc;
        }, {});

        topic.responses.forEach((response: any) => {
            const { user, text, media, createdAt } = response;
            usersResponses[user].responses.push({ text, media, createdAt });
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                topic,
                usersResponses,
                family,
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
