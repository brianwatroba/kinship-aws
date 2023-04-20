import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { Parameter } from 'aws-sdk/clients/ssm';
import { getSsmParams } from '../utils/getSsmParams';
import { Twilio } from 'twilio';

function extractText(str: string): string {
    const pattern = /(?<=\/prod\/twilio\/).*/;
    const match = str.match(pattern);
    return match ? match[0] : 'key';
}

export const sendMessageHandler = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
    try {
        const twilioVals = await getSsmParams('/prod/twilio');
        const vals: { [key: string]: string } = {};
        twilioVals.forEach((val: Parameter) => {
            if (!val.Name || !val.Value) return;
            vals[extractText(val.Name)] = val.Value;
        });

        const twilio = new Twilio(vals.accountSid, vals.authToken);
        const text = 'testing - you cannot respond yet';

        const myNumber = '+18103330792';

        const res = await twilio.messages.create({
            body: text,
            from: '+18449320927',
            to: myNumber,
        });

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
