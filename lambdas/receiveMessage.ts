import { APIGatewayProxyResult } from 'aws-lambda';
import { parseUrlEncoded } from '../utils/common';
import { TwilioWebhookEvent } from '../__tests__/fixtures/events';
import { User } from '../models/User';
import { Topic } from '../models/Topic';

export const receiveMessageHandler = async (event: TwilioWebhookEvent): Promise<APIGatewayProxyResult> => {
    try {
        // verify message integrity

        const { body } = event;
        if (body === null || body === undefined) throw new Error('No body in event');
        const parsedBody = parseUrlEncoded(body);
        const phoneNumber = `${parsedBody.From.replace(' ', '+')}`;
        const text = parsedBody.Body;
        console.log('parsedBody', parsedBody);
        console.log('phoneNumber', phoneNumber);
        console.log('text', text);

        const user: any = await User.get(phoneNumber);

        const [topic] = await Topic.query('familyId').eq(user.familyId).sort('descending').limit(1).exec();

        const response = {
            user: user.id,
            text,
        };

        topic.responses.push(response);
        topic.answeredBy[user.id] = true;
        await topic.save();

        // create new response
        // mark answered by
        // if complete, mark complete
        // save topic
        // send response

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
