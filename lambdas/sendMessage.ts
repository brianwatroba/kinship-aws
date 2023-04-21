import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '../config/constants';
import { Twilio } from 'twilio';

export const sendMessageHandler = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
    try {
        const twilio = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        if (event.Records.length > 1) throw new Error('Too many records in SQS event! Should only be one');

        const record = event.Records[0];
        const { text, to, from } = JSON.parse(record.body);

        const res = await twilio.messages.create({
            body: text,
            from,
            to,
        });

        const { status } = res;

        const sentSuccess = status === 'queued' || status === 'sending' || status === 'sent';
        if (sentSuccess) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Success! Status: ${status}`,
                }),
            };
        }

        throw new Error(`Failed to send message. Status: ${status}`);
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
