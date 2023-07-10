import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { twilioClient } from '../../config/clients';
import { validateSqsEvent, parseSqsEventBody } from '../../utils/aws';

export const sendSmsHandler = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
    try {
        validateSqsEvent(event);
        const [firstRecord] = parseSqsEventBody(event);
        const { body, to, from, mediaUrl } = firstRecord;
        const { status } = await twilioClient.messages.create({ body, to, from, mediaUrl });
        const sentSuccess = ['queued', 'sending', 'sent'].includes(status);
        if (!sentSuccess) throw new Error(`Failed to send twilio text. Status: ${status}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Success! Sms sent status: ${status}`,
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
