import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const SummarySchema = new dynamoose.Schema({
    id: {
        type: String,
        default: uuidv4,
    },
    s3Url: {
        type: String,
        default: '',
    },
});

const ResponseSchema = new dynamoose.Schema({
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
});

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
        responsesLeft: {
            type: Number,
            required: true,
        },
        summary: SummarySchema,
        createdAt: {
            type: Date,
            rangeKey: true,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Topic = dynamoose.model('Topics', TopicSchema);
