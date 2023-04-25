import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const ResponseSchema = new dynamoose.Schema({
    user: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        default: '',
    },
    media: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

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
        },
        prompt: {
            type: String,
            required: true,
        },
        responses: {
            type: Array,
            schema: [ResponseSchema],
            default: [],
        },
        answeredBy: {
            type: Object,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        saveUnknown: [
            'answeredBy.*', // store 1 level deep of nested properties in `answeredBy` property
        ],
        timestamps: true,
    },
);

export const Topic = dynamoose.model('Topics', TopicSchema);
