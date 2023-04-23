import { dbClientRaw } from '../config/clients';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

export const getItem = async (params: {
    tableName: string;
    partitionKey: string;
    value: string;
}): Promise<Record<string, NativeAttributeValue>> => {
    const { tableName, partitionKey, value } = params;

    const command = new GetCommand({
        TableName: tableName,
        Key: { [partitionKey]: value },
    });

    const res = await dbClientRaw.send(command);

    return [res.Item ?? []];
};

export const getAllItems = async (params: { tableName: string }): Promise<Record<string, NativeAttributeValue>> => {
    const { tableName } = params;

    const command = new ScanCommand({
        TableName: tableName,
    });

    const res = await dbClientRaw.send(command);

    return res.Items ?? [];
};
