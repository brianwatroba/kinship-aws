export const SQS_CONFIG = {
    MAX_MESSAGE_SIZE: 1,
    URLS: {
        SEND_MESSAGE: process.env.SQS_SEND_MESSAGE_QUEUE_URL ?? '',
        START_TOPIC: process.env.SQS_START_TOPIC_QUEUE_URL ?? '',
    },
};

export const TWILIO_CONFIG = {
    ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ?? '',
    AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ?? '',
    URLS: {
        WEBHOOK: process.env.TWILIO_WEBHOOK_URL ?? '',
    },
    PHONE_NUMBERS: {
        KINSHIP: process.env.TWILIO_PHONE_NUMBER ?? '',
    },
};

export const CLIENT_CONFIG = {
    URLS: { TOPIC_ID: 'https://main.d3ql2zjyjkibh4.amplifyapp.com/summaries/' },
};

export const AWS_CONFIG = {
    region: 'us-east-1',
    apiVersion: '2014-11-06',
};
