import { User } from '../models/index';

//TODO: unfinished
export const getUserById = async (params: { id: string }) => {
    return false;
};

export const getUserByPhoneNumber = async (params: { phoneNumber: string }) => {
    return User.get(params.phoneNumber);
};

export const getAllUsersByFamily = async (params: { familyId: string }) => {
    const users = await User.query({ familyId: { eq: params.familyId } }).exec();
    if (users.length < 1) throw new Error('No familyMembers found in family');
    return users;
};
