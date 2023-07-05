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
        participants: {
            type: Set,
            schema: [String],
            required: true,
        },
        whoHasAnswered: {
            type: Set,
            schema: [String],
            default: [],
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

const Topic = dynamoose.model('Topics', TopicSchema);

Topic.methods.set('getLatest', async (familyId) => {
    const [current] = await Topic.query('familyId').eq(familyId).sort('descending').limit(1).exec();
    return current;
});

export { Topic };
