import { APIGatewayProxyResult, ScheduledEvent } from 'aws-lambda';
import { sendMessage } from '../utils/sqs';
import { SQS_SEND_MESSAGE_QUEUE_URL, TWILIO_PHONE_NUMBER } from '../config/constants';
import { User } from '../models/User';

export const startTopicHandler = async (event: ScheduledEvent): Promise<APIGatewayProxyResult> => {
    try {
        // message payload: prompt, familyId
        // ensure the family doesn't have a current topic running
        // get all users in the family
        // create topic instance
        // send messages to all users in the family

        const allUsers = await User.scan().exec();

        const promises = allUsers.map((user: Record<string, any>) => {
            const payload = {
                to: user.phoneNumber,
                from: TWILIO_PHONE_NUMBER,
                text: 'Hey there! Testing blast bulk sms messges',
            };
            return sendMessage({ queueUrl: SQS_SEND_MESSAGE_QUEUE_URL, payload });
        });

        await Promise.all(promises);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Success! Sent ${promises.length} messages`,
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
