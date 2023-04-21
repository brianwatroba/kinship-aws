export const parseUrlEncoded = (body: string): { [key: string]: string } => {
    const bodyParams = new URLSearchParams(body);

    const params: { [key: string]: string } = {};

    bodyParams.forEach((value, key) => {
        params[key] = decodeURIComponent(value.replace(/\+/g, ' '));
    });

    return params;
};
