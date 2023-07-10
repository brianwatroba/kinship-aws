import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getTopic } from '../../services/topicService';

export const getTopicHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { pathParameters } = event;
        if (pathParameters === null || pathParameters === undefined) throw new Error('No path parameters');

        const { topicId } = pathParameters;
        if (topicId === null || topicId === undefined) throw new Error('No topicId');

        const [topic] = await getTopic({ id: topicId });
        if (!topic) throw new Error('Topic not found');

        return {
            statusCode: 200,
            body: JSON.stringify(topic),
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
