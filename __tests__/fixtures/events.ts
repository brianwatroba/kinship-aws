import { SQSEvent, APIGatewayProxyEvent, ScheduledEvent } from 'aws-lambda';
import { TWILIO_CONFIG } from '../../config/constants';

// SendMessageFunction

const baseRecordData = {
    messageId: '12345',
    receiptHandle: 'abcde',
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
};

export const sendMessageSqsEvents: { [key: string]: SQSEvent } = {
    valid: {
        Records: [
            {
                ...baseRecordData,
                body: JSON.stringify({
                    to: '+12125678901', // valid via Twilio
                    text: 'valid phone number message',
                    from: TWILIO_CONFIG.PHONE_NUMBERS.KINSHIP,
                }),
            },
        ],
    },
    invalid: {
        Records: [
            {
                ...baseRecordData,
                body: JSON.stringify({
                    to: '+15005550001', // invalid via Twilio
                    text: 'invalid phone number message',
                    from: TWILIO_CONFIG.PHONE_NUMBERS.KINSHIP,
                }),
            },
        ],
    },
    tooManyRecords: {
        Records: [
            {
                ...baseRecordData,
                body: JSON.stringify({
                    to: '+12125678901', // valid via Twilio
                    text: 'valid phone number message',
                    from: TWILIO_CONFIG.PHONE_NUMBERS.KINSHIP,
                }),
            },
            {
                ...baseRecordData,
                body: JSON.stringify({
                    to: '+12125678901', // valid via Twilio
                    text: 'valid phone number message',
                    from: TWILIO_CONFIG.PHONE_NUMBERS.KINSHIP,
                }),
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

// StartTopicsFunction;

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

export type TwilioWebhookEvent = APIGatewayProxyEvent & { headers: { 'X-Twilio-Signature': string } };

export const twilioWebhookEvents: {
    [key: string]: TwilioWebhookEvent;
} = {
    valid: {
        resource: '/receiveMessage',
        path: '/receiveMessage',
        httpMethod: 'POST',
        headers: {
            Accept: '*/*',
            'CloudFront-Forwarded-Proto': 'https',
            'CloudFront-Is-Desktop-Viewer': 'true',
            'CloudFront-Is-Mobile-Viewer': 'false',
            'CloudFront-Is-SmartTV-Viewer': 'false',
            'CloudFront-Is-Tablet-Viewer': 'false',
            'CloudFront-Viewer-ASN': '14618',
            'CloudFront-Viewer-Country': 'US',
            'Content-Type': 'application/x-www-form-urlencoded',
            Host: 'w2mrwgygx5.execute-api.us-east-1.amazonaws.com',
            'I-Twilio-Idempotency-Token': '79973372-368a-4597-8e52-b2bdf630ae69',
            'User-Agent': 'TwilioProxy/1.1',
            Via: '1.1 f99ff04b44b46caf63e2de40aa2beda4.cloudfront.net (CloudFront)',
            'X-Amz-Cf-Id': 'R_88kzRP1GfkAel4XH-syasy0hUrmqSEJGkunR4KHUYErPFX2JYTLg==',
            'X-Amzn-Trace-Id': 'Root=1-64469f90-583129c05199f65a54875ec7',
            'X-Forwarded-For': '34.226.200.122, 15.158.60.19',
            'X-Forwarded-Port': '443',
            'X-Forwarded-Proto': 'https',
            'X-Home-Region': 'us1',
            'X-Twilio-Signature': 'QtpDe3RpT9OZqp6h5vuz0kR/jeE=',
        },
        multiValueHeaders: {
            Accept: ['*/*'],
            'CloudFront-Forwarded-Proto': ['https'],
            'CloudFront-Is-Desktop-Viewer': ['true'],
            'CloudFront-Is-Mobile-Viewer': ['false'],
            'CloudFront-Is-SmartTV-Viewer': ['false'],
            'CloudFront-Is-Tablet-Viewer': ['false'],
            'CloudFront-Viewer-ASN': ['14618'],
            'CloudFront-Viewer-Country': ['US'],
            'Content-Type': ['application/x-www-form-urlencoded'],
            Host: ['w2mrwgygx5.execute-api.us-east-1.amazonaws.com'],
            'I-Twilio-Idempotency-Token': ['79973372-368a-4597-8e52-b2bdf630ae69'],
            'User-Agent': ['TwilioProxy/1.1'],
            Via: ['1.1 f99ff04b44b46caf63e2de40aa2beda4.cloudfront.net (CloudFront)'],
            'X-Amz-Cf-Id': ['R_88kzRP1GfkAel4XH-syasy0hUrmqSEJGkunR4KHUYErPFX2JYTLg=='],
            'X-Amzn-Trace-Id': ['Root=1-64469f90-583129c05199f65a54875ec7'],
            'X-Forwarded-For': ['34.226.200.122, 15.158.60.19'],
            'X-Forwarded-Port': ['443'],
            'X-Forwarded-Proto': ['https'],
            'X-Home-Region': ['us1'],
            'X-Twilio-Signature': ['QtpDe3RpT9OZqp6h5vuz0kR/jeE='],
        },
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        pathParameters: null,
        stageVariables: null,
        requestContext: {
            resourceId: 'gew0ux',
            resourcePath: '/receiveMessage',
            httpMethod: 'POST',
            extendedRequestId: 'D43eqEuqoAMF7eg=',
            requestTime: '24/Apr/2023:15:26:08 +0000',
            path: '/Prod/receiveMessage',
            accountId: '643910145100',
            protocol: 'HTTP/1.1',
            stage: 'Prod',
            domainPrefix: 'w2mrwgygx5',
            requestTimeEpoch: 1682349968743,
            requestId: 'db3f45cc-d5c9-401f-a5d1-c825a3ef3ee9',
            identity: {
                cognitoIdentityPoolId: null,
                accountId: null,
                cognitoIdentityId: null,
                caller: null,
                sourceIp: '34.226.200.122',
                principalOrgId: null,
                accessKey: null,
                cognitoAuthenticationType: null,
                cognitoAuthenticationProvider: null,
                userArn: null,
                userAgent: 'TwilioProxy/1.1',
                user: null,
                apiKey: null,
                apiKeyId: null,
                clientCert: null,
            },
            authorizer: {},
            domainName: 'w2mrwgygx5.execute-api.us-east-1.amazonaws.com',
            apiId: 'w2mrwgygx5',
        },
        body: 'ToCountry=US&ToState=&SmsMessageSid=SMad915f4da8bef94e2e38695d980805ef&NumMedia=0&ToCity=&FromZip=48116&SmsSid=SMad915f4da8bef94e2e38695d980805ef&FromState=MI&SmsStatus=received&FromCity=BRIGHTON&Body=Test+message&FromCountry=US&To=%2B18449320927&MessagingServiceSid=MG315f99a5e95e40ee78d8ff99e3fb5dda&ToZip=&NumSegments=1&MessageSid=SMad915f4da8bef94e2e38695d980805ef&AccountSid=AC79c849efa672ba9f13ce6af4e8bf083c&From=%2B18103330792&ApiVersion=2010-04-01',
        isBase64Encoded: false,
    },
};
