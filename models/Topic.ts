import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const SummarySchema = new dynamoose.Schema({
    id: {
        type: String,
        default: uuidv4,
    },
    mediaUrl: {
        type: String,
        default: '',
    },
});

const ResponseSchema = new dynamoose.Schema(
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
);

const TopicSchema = new dynamoose.Schema(
    {
        familyId: {
            type: String,
            hashKey: true,
            required: true,
        },
        prompt: {
            type: String,
            required: true,
        },
        responses: [ResponseSchema],
        answeredBy: {
            type: Object,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        summary: SummarySchema,
    },
    {
        timestamps: true,
    },
);

export const Topic = dynamoose.model('Topics', TopicSchema);
