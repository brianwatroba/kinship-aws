import { SSMClient, GetParametersByPathCommand, Parameter } from '@aws-sdk/client-ssm';
import { prompts } from '../constants/prompts';
import dayjs from 'dayjs';

export const getSsmParams = async (path: string): Promise<Parameter[]> => {
    const ssm = new SSMClient({ region: 'us-east-1' });

    const params = new GetParametersByPathCommand({
        Path: path,
        WithDecryption: false,
    });

    const response = await ssm.send(params);

    if (response.Parameters) return response.Parameters;

    throw new Error('No parameters found');
};

export const parseUrlEncoded = (body: string): { [key: string]: string } => {
    const bodyParams = new URLSearchParams(body);

    const params: { [key: string]: string } = {};

    bodyParams.forEach((value, key) => {
        params[key] = decodeURIComponent(value.replace(/\+/g, ' '));
    });

    return params;
};

export const getRandomValueInRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generatePrompt = () => {
    const days: { name: string; shouldSend: boolean; promptWeight: string }[] = [
        { name: 'SUNDAY', shouldSend: true, promptWeight: 'heavy' },
        { name: 'MONDAY', shouldSend: false, promptWeight: 'light' },
        { name: 'TUESDAY', shouldSend: true, promptWeight: 'medium' },
        { name: 'WEDNESDAY', shouldSend: false, promptWeight: 'light' },
        { name: 'THURSDAY', shouldSend: false, promptWeight: 'light' },
        { name: 'FRIDAY', shouldSend: true, promptWeight: 'light' },
        { name: 'SATURDAY', shouldSend: false, promptWeight: 'light' },
    ];

    const today = days.at(dayjs().day());
    if (!today) throw new Error('Incorrect day');

    const possiblePrompts = prompts[today.promptWeight];

    const randIndex = getRandomValueInRange(0, possiblePrompts.length - 1);
    if (!possiblePrompts) throw new Error('No prompts for today');
    return possiblePrompts[randIndex];
};
c;
