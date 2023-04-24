import { APIGatewayProxyResult } from 'aws-lambda';
import { parseUrlEncoded } from '../utils/common';
import { TwilioWebhookEvent } from '../__tests__/fixtures/events';
import { User } from '../models/User';

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

        const user = await User.query({ phoneNumber: { eq: phoneNumber } }).exec();

        console.log(user);

        // lookup the user
        // look up topic to see if it's still active

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
