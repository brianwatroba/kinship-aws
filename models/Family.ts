import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

import { Item } from 'dynamoose/dist/Item';

interface FamilyModel extends Item {
    id: string;
    name: string;
    image: string;
    paused: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FamilySchema = new dynamoose.Schema(
    {
        id: {
            type: String,
            hashKey: true,
            default: uuidv4(),
        },
        name: {
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

export const Family = dynamoose.model<FamilyModel>('Families', FamilySchema);
