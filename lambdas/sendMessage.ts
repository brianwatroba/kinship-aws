import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';

import { getSsmParams } from '../utils/getSsmParams';
export const sendMessageHandler = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
    try {
        const res = JSON.stringify(await getSsmParams('/prod/twilio'));
        console.log(res);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: res,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
