import { SSMClient, GetParametersByPathCommand, Parameter } from '@aws-sdk/client-ssm';

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
