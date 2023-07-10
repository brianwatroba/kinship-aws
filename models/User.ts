import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { Item } from 'dynamoose/dist/Item';

export interface UserModel extends Item {
    id: string;
    phoneNumber: string;
    familyId: string;
    firstName: string;
    lastName: string;
    image: string;
    paused: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new dynamoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4(),
        },
        phoneNumber: {
            type: String,
            hashKey: true,
            required: true,
        },
        familyId: {
            type: String,
            required: true,
            index: {
                name: 'familyIdIndex',
            },
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        paused: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const User = dynamoose.model<UserModel>('Users', UserSchema);

export { User };
