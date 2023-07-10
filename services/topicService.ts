import { Topic } from '../models/index';
import { getPostsByTopic } from './postService';
import { getAllUsersByFamily } from './userService';
import { generatePrompt } from '../utils/common';
import { sendManySms } from './smsService';

export const getTopic = async (params: { id: string }) => {
    return Topic.scan('id').eq(params.id).exec();
};

export const getActiveTopic = async ({ familyId }: { familyId: string }) => {
    const [topic] = await Topic.query('familyId').eq(familyId).sort('descending').limit(1).exec();
    return topic.isCompleted ? undefined : topic;
};

export const getTopicStatus = async (params: { topicId: string }) => {
    const { topicId } = params;
    const topic = await Topic.get(topicId);
    const posts = await getPostsByTopic({ topicId });

    const { participants } = topic;
    const whoHasAnswered = [...new Set(posts.map((post) => post.userId))];
    const whoHasNotAnswered = participants.filter((user: string) => !whoHasAnswered.includes(user));
    const isCompleted = whoHasAnswered.length === participants.length;
    const isSummarySent = topic.isSummarySent;

    return {
        participants,
        whoHasAnswered,
        whoHasNotAnswered,
        isCompleted,
        isSummarySent,
    };
};

export const syncTopicStatus = async (params: { topicId: string }) => {
    const { topicId } = params;
    const { participants, whoHasAnswered, whoHasNotAnswered, isCompleted, isSummarySent } = await getTopicStatus({
        topicId: params.topicId,
    });
    await Topic.update({ id: topicId }, { participants, whoHasAnswered, whoHasNotAnswered, isCompleted });

    return {
        participants,
        whoHasAnswered,
        whoHasNotAnswered,
        isCompleted,
        isSummarySent,
    };
};

export const startTopic = async (params: { familyId: string }) => {
    const { familyId } = params;
    const familyMembers = await getAllUsersByFamily({ familyId });

    const topic = await Topic.create({
        familyId,
        prompt: generatePrompt(),
        participants: familyMembers.map((user) => user.id),
    });

    await sendManySms(familyMembers.map((user) => ({ to: user.phoneNumber, body: topic.prompt })));
};
