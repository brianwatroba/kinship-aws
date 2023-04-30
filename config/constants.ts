export const SQS_SEND_MESSAGE_QUEUE_URL = process.env.SQS_SEND_MESSAGE_QUEUE_URL ?? '';
export const SQS_START_TOPIC_QUEUE_URL = process.env.SQS_START_TOPIC_QUEUE_URL ?? '';

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? '';
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? '';
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER ?? '';
export const TWILIO_WEBHOOK_URL = process.env.TWILIO_WEBHOOK_URL ?? '';

export const STANDARD_RESPONSES = {
    RESPONSE_SAVED: 'SAVED ✅',
};

export const awsConfig = {
    region: 'us-east-1',
    apiVersion: '2014-11-06',
};

export const prompts = [
    "What is the most interesting thing you can show me within arm's reach?",
    'Can you show me a picture of your favorite gadget or tech accessory?',
    'What is your favorite spot in your home? Can you share a photo?',
    'What is the last thing you bought online? Can you show me a photo?',
];
