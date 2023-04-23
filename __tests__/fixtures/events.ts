import { SQSEvent, APIGatewayProxyEvent, ScheduledEvent } from 'aws-lambda';
import { VALID_FROM_PHONE_NUMBER } from './constants';

// SendMessageFunction

export const sendMessageSqsEvents: { [key: string]: SQSEvent } = {
    valid: {
        Records: [
            {
                messageId: '12345',
                receiptHandle: 'abcde',
                body: JSON.stringify({ to: '+18105556666', text: 'hello world', from: VALID_FROM_PHONE_NUMBER }),
                attributes: {
                    ApproximateReceiveCount: '1',
                    SentTimestamp: '123456789',
                    SenderId: '123456789',
                    ApproximateFirstReceiveTimestamp: '123456789',
                },
                messageAttributes: {},
                md5OfBody: '',
                eventSource: '',
                eventSourceARN: '',
                awsRegion: '',
            },
        ],
    },
};

// ReceiveMessageFunction

export const receiveMessageApiEvents: { [key: string]: APIGatewayProxyEvent } = {
    valid: {
        httpMethod: 'post',
        body: 'ToCountry=US&ToState=&SmsMessageSid=abc123&NumMedia=0&ToCity=&FromZip=48116&SmsSid=SMacabc123&FromState=MI&SmsStatus=received&FromCity=SANFRANCISCO&Body=Testing&FromCountry=US&To=%2B18005556666&MessagingServiceSid=MGabc123&ToZip=&NumSegments=1&MessageSid=SMacabc123&AccountSid=ACabc123&From=%2B12345671212&ApiVersion=2010-04-01',
        headers: {},
        isBase64Encoded: false,
        multiValueHeaders: {},
        multiValueQueryStringParameters: {},
        path: '/hello',
        pathParameters: {},
        queryStringParameters: {},
        requestContext: {
            accountId: '123456789012',
            apiId: '1234',
            authorizer: {},
            httpMethod: 'get',
            identity: {
                accessKey: '',
                accountId: '',
                apiKey: '',
                apiKeyId: '',
                caller: '',
                clientCert: {
                    clientCertPem: '',
                    issuerDN: '',
                    serialNumber: '',
                    subjectDN: '',
                    validity: { notAfter: '', notBefore: '' },
                },
                cognitoAuthenticationProvider: '',
                cognitoAuthenticationType: '',
                cognitoIdentityId: '',
                cognitoIdentityPoolId: '',
                principalOrgId: '',
                sourceIp: '',
                user: '',
                userAgent: '',
                userArn: '',
            },
            path: '/hello',
            protocol: 'HTTP/1.1',
            requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
            requestTimeEpoch: 1428582896000,
            resourceId: '123456',
            resourcePath: '/hello',
            stage: 'dev',
        },
        resource: '',
        stageVariables: {},
    },
};

// StartTopicsFunction

export const startTopicsScheduledEvent: { [key: string]: ScheduledEvent } = {
    valid: {
        version: '0',
        account: '123456789012',
        region: 'us-east-2',
        detail: {},
        'detail-type': 'Scheduled Event',
        source: 'aws.events',
        time: '2019-03-01T01:23:45Z',
        id: 'cdc73f9d-aea9-11e3-9d5a-835b769c0d9c',
        resources: ['arn:aws:events:us-east-2:123456789012:rule/my-schedule'],
    },
};

export const startTopicSqsQueueEvents: { [key: string]: SQSEvent } = {
    valid: {
        Records: [
            {
                messageId: '12345',
                receiptHandle: 'abcde',
                body: JSON.stringify({
                    familyId: '8ff23aec-5dab-4e59-bd3a-a654e5e037b8',
                    prompt: 'What is your favorite color?',
                }),
                attributes: {
                    ApproximateReceiveCount: '1',
                    SentTimestamp: '123456789',
                    SenderId: '123456789',
                    ApproximateFirstReceiveTimestamp: '123456789',
                },
                messageAttributes: {},
                md5OfBody: '',
                eventSource: '',
                eventSourceARN: '',
                awsRegion: '',
            },
        ],
    },
};
