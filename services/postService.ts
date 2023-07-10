import { Post } from '../models/index';
import { getActiveTopic, syncTopicStatus } from './topicService';
import { getUserByPhoneNumber } from './userService';
import { sendTopicSummary } from './smsService';
import { RESPONSES } from '../constants/responses';

export const createPostsFromSms = async ({ from, text, media }: { from: string; text?: string; media?: string[] }) => {
    const responsesToUser = [];
    const user = await getUserByPhoneNumber({ phoneNumber: from });

    // Ensure active topic
    const activeTopic = await getActiveTopic({ familyId: user.familyId });
    if (!activeTopic) {
        responsesToUser.push(RESPONSES.NO_ACTIVE_TOPIC);
        return responsesToUser;
    }

    // Create new posts
    const newPosts = [];
    if (text) newPosts.push(new Post({ topicId: activeTopic.id, user: user.id, text }));
    if (media)
        media.forEach((item) => newPosts.push(new Post({ topicId: activeTopic.id, user: user.id, media: item })));
    await Post.batchPut(newPosts);

    // Update topic status
    const { participants, whoHasAnswered, isCompleted, isSummarySent } = await syncTopicStatus({
        topicId: activeTopic.id,
    });
    responsesToUser.push(RESPONSES.SAVED({ responded: whoHasAnswered.length, total: participants.length }));

    // Trigger summary if completed
    if (isCompleted && isSummarySent) await sendTopicSummary({ topicId: activeTopic.id });

    return responsesToUser;
};

export const createPost = async (params: { topicId: string; user: string; text?: string; mediaUrl?: string }) => {
    return Post.create(params);
};

export const getPostsByTopic = async (params: { topicId: string }) => {
    const { topicId } = params;
    return Post.query('topicId').eq(topicId).exec();
};
