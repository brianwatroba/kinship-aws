import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { parseUrlEncoded } from '../utils/common';
import { getItem } from '../utils/dynamodb';

export const receiveMessageHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // verify message integrity

        const { body } = event;
        if (body === null || body === undefined) throw new Error('No body in event');
        const { From: phoneNumber, Body: text } = parseUrlEncoded(body);

        const getItemParams = { tableName: 'Users', partitionKey: 'phoneNumber', value: phoneNumber };

        const user = await getItem(getItemParams);

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
