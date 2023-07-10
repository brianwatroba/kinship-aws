import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPostsByTopic } from '../../services/postService';

export const getPostsByTopicHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { pathParameters } = event;
        if (pathParameters === null || pathParameters === undefined) throw new Error('No path parameters');

        const { topicId } = pathParameters;
        if (topicId === null || topicId === undefined) throw new Error('No topicId');

        const topicPosts = await getPostsByTopic({ topicId });

        return {
            statusCode: 200,
            body: JSON.stringify(topicPosts),
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
