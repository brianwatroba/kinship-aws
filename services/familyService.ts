import { Family } from '../models/index';

export const getFamily = async (params: { id: string }) => {
    return Family.get(params.id);
};

export const getAllFamilies = async () => {
    //TODO: add filter for active families (not paused)
    return await Family.scan().exec();
};
