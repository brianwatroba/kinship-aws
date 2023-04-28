import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

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

export const User = dynamoose.model('Users', UserSchema);
