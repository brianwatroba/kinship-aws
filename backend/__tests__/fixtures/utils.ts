import { Model } from 'dynamoose/dist/Model';

export const mockModelFunc = (model: Model, func: 'scan' | 'query' | 'create', output: any) => {
    const scanSpy = jest.spyOn(model, func);
    scanSpy.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(output),
    } as any);
};
