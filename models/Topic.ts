import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { Item } from 'dynamoose/dist/Item';

export interface TopicModel extends Item {
    id: string;
    familyId: string;
    prompt: string;
    participants: string[];
    whoHasAnswered: string[];
    whoHasNotAnswered: string[];
    isCompleted: boolean;
    isSummarySent: boolean;
    createdAt: Date;
    updatedAt: Date;
}

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
        participants: {
            type: Array,
            schema: [String],
            required: true,
        },
        whoHasAnswered: {
            type: Array,
            schema: [String],
            default: [],
        },
        whoHasNotAnswered: {
            type: Array,
            schema: [String],
            default: [],
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        isSummarySent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Topic = dynamoose.model<TopicModel>('Topics', TopicSchema);
