import { APIGatewayProxyResult } from 'aws-lambda';
import { TwilioWebhookEvent } from '../../types';
import { createPostsFromSms } from '../../services/postService';
import { validateTwilioWebhookEvent, parseTwilioWebhookEventBody } from '../../utils/twilio';
import { sendManySms } from '../../services/smsService';

export const receiveSmsHandler = async (event: TwilioWebhookEvent): Promise<APIGatewayProxyResult> => {
    try {
        validateTwilioWebhookEvent(event);
        const { from, text, media } = parseTwilioWebhookEventBody(event);

        const smsResponsesToSend = await createPostsFromSms({ from, text, media });

        await sendManySms(smsResponsesToSend.map((response) => ({ to: from, body: response })));

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
