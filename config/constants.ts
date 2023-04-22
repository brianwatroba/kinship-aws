export const SQS_SEND_MESSAGE_QUEUE_URL = process.env.SQS_SEND_MESSAGE_QUEUE_URL ?? '';

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export const awsConfig = {
    region: 'us-east-1',
    apiVersion: '2014-11-06',
};
