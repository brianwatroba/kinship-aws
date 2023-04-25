import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const TopicSchema = new dynamoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4(),
        },
        familyId: {
            type: String,
            hashKey: true,
            required: true,
            index: {
                name: 'createdAtIndex',
                rangeKey: 'createdAt',
            },
        },
        prompt: {
            type: String,
            required: true,
        },
        responses: {
            type: [
                new dynamoose.Schema(
                    {
                        user: {
                            type: String,
                            required: true,
                        },
                        text: {
                            type: String,
                        },
                        media: {
                            type: String,
                        },
                    },
                    {
                        timestamps: true,
                    },
                ),
            ],
            default: [],
        },
        answeredBy: {
            type: Object,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Topic = dynamoose.model('Topics', TopicSchema);
