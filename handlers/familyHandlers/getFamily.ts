import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getFamily } from '../../services/familyService';

export const getFamilyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { pathParameters } = event;
        if (pathParameters === null || pathParameters === undefined) throw new Error('No path parameters');

        const { familyId } = pathParameters;
        if (familyId === null || familyId === undefined) throw new Error('No familyId');

        const family = await getFamily({ id: familyId });
        if (!family) throw new Error('family not found');

        return {
            statusCode: 200,
            body: JSON.stringify(family),
        };
    } catch (err: any) {
        console.log(err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err.message,
            }),
        };
    }
};
