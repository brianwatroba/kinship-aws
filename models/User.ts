import dynamoose from 'dynamoose';

const UserSchema = new dynamoose.Schema(
    {
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
    },
    { timestamps: true },
);

export const User = dynamoose.model('Users', UserSchema);
