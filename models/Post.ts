import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { Item } from 'dynamoose/dist/Item';

interface PostModel extends Item {
    id: string;
    topicId: string;
    userId: string;
    text: string;
    media: string;
    createdAt: Date;
}

const PostSchema = new dynamoose.Schema({
    id: {
        type: String,
        default: uuidv4(),
    },
    topicId: {
        type: String,
        hashKey: true,
        required: true,
    },
    userId: {
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

export const Post = dynamoose.model<PostModel>('Posts', PostSchema);
