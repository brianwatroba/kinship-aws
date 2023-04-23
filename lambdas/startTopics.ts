import { APIGatewayProxyResult, ScheduledEvent } from 'aws-lambda';
// import { getAllItems } from '../utils/dynamodb';
// import { sendMessage } from '../utils/sqs';
// import { SQS_SEND_MESSAGE_QUEUE_URL, TWILIO_PHONE_NUMBER } from '../config/constants';
import { User } from '../models/User';

export const startTopicsHandler = async (event: ScheduledEvent): Promise<APIGatewayProxyResult> => {
    try {
        // const allUsers = await getAllItems({ tableName: 'Users' });

        const allUsers = await User.scan().exec();

        console.log(allUsers);

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
