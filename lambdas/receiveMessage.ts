import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { parseUrlEncoded } from '../utils/parseUrlEncoded';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

export const receiveMessageHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // verify message integrity

        const { body } = event;
        if (body === null || body === undefined) throw new Error('No body in event');
        const { From: phoneNumber, Body: text } = parseUrlEncoded(body);

        const client = new DynamoDBClient({ region: 'us-east-1' });

        const params = {
            TableName: 'Users',
            KeyConditionExpression: 'phoneNumber = :phoneNumber',
            ExpressionAttributeValues: {
                ':phoneNumber': { S: 'phoneNumber' },
            },
        };
        const command = new QueryCommand(params);

        const data = await client.send(command);

        console.log(data);

        // do something with the message

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
