import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as Eta from 'eta';

export const renderSummaryHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const myTemplate = '<p>My favorite kind of cake is: <%= it.favoriteCake %></p>';
        const body = Eta.render(myTemplate, { favoriteCake: 'Chocolate!' });

        return {
            statusCode: 200,
            headers: { 'Content-type': 'text/html' },
            body,
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
