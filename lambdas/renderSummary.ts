import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Topic } from '../models/Topic';
import { Family } from '../models/Family';
import { User } from '../models/User';
import { webpage } from '../views/pages/summary';
import * as eta from 'eta';
import path from 'path';
// import summaryTemplate from '../views/pages/summary.eta';

//TODO: need to factor in a get request with uuid for topic

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

        // const myTemplate =
        //     '<h1>The <%= it.family.name %> Family</h1> <h3>Question: <%= it.topic.prompt %></h3> <h4>Responses:<h4> <ul> <% for (const response of it.topic.responses) { %> <li> <%= response.text %></li> <% } %> </ul>';
        const pages = eta.render(webpage, { topic, family });

        return {
            statusCode: 200,
            headers: { 'Content-type': 'text/html' },
            body: pages,
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

// a83b6266-6bfe-4efb-b15f-9f3d915ac975
