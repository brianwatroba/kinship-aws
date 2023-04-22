import { APIGatewayProxyResult, ScheduledEvent } from 'aws-lambda';
import { getAllItems } from '../utils/dynamodb';
import { sendMessage } from '../utils/sqs';
import { SQS_SEND_MESSAGE_QUEUE_URL, TWILIO_PHONE_NUMBER } from '../config/constants';

export const startTopicsHandler = async (event: ScheduledEvent): Promise<APIGatewayProxyResult> => {
    try {
        const allUsers = await getAllItems({ tableName: 'Users' });

        console.log(allUsers);

        // const text = 'Hey there! Testing blast bulk sms messges';
        // const from = TWILIO_PHONE_NUMBER;

        // const promises = allUsers.map((user: Record<string, any>) => {
        //     const payload = {
        //         to: user.phoneNumber,
        //         from,
        //         text,
        //     };
        //     sendMessage({ queueUrl: SQS_SEND_MESSAGE_QUEUE_URL, payload });
        // });

        // const res = await Promise.all(promises);

        // console.log(res);

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
