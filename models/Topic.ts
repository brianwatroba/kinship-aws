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

const TopicSchema = new dynamoose.Schema(
    {
        familyId: {
            type: String,
            hashKey: true,
            required: true,
        },
        createdAt: {
            type: Date,
            rangeKey: true,
            required: true,
        },
        responsesLeft: {
            type: Number,
            required: true,
        },
        summary: SummarySchema,
    },
    {
        timestamps: true,
    },
);

export const Topic = dynamoose.model('Topics', TopicSchema);
