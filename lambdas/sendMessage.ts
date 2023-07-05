import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { TWILIO_CONFIG, SQS_CONFIG } from '../config/constants';
import { Twilio } from 'twilio';

const twilioClient = new Twilio(TWILIO_CONFIG.ACCOUNT_SID, TWILIO_CONFIG.AUTH_TOKEN);

export const sendMessageHandler = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (event.Records.length > SQS_CONFIG.MAX_MESSAGE_SIZE)
            throw new Error('Too many records in SQS event! Should only be one');

        const { text, to } = JSON.parse(event.Records[0].body);

        const { status } = await twilioClient.messages.create({
            body: text,
            from: TWILIO_CONFIG.PHONE_NUMBERS.KINSHIP,
            to,
        });

        const sentSuccess = ['queued', 'sending', 'sent'].includes(status);
        if (!sentSuccess) throw new Error(`Failed to send twilio text. Status: ${status}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Success! Status: ${status}`,
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
