import { User } from '../../models/User';
// import { Family } from '../../models/Family';
import { Topic } from '../../models/Topic';

const family1Id = '8ff23aec-5dab-4e59-bd3a-a654e5e037b8';
const family2Id = '8ff2442c-63af-4485-84ba-5b8c37716e29';

export const users = [
    {
        id: 'f06d2545-d013-42a8-b6ab-41c4b0428ea4',
        phoneNumber: '+12222222222',
        firstName: 'Brian',
        lastName: 'Smith',
        familyId: family1Id,
        image: 'https://example.com/image.jpg',
        paused: false,
    },
    {
        id: '079c4b19-a067-4602-9f7b-47b7ac463448',
        phoneNumber: '+13333333333',
        firstName: 'Kevin',
        lastName: 'Smith',
        familyId: family1Id,
        image: 'https://example.com/image.jpg',
        paused: false,
    },
    {
        id: '0a544016-7798-4b78-8f11-a15f15b644c2',
        phoneNumber: '+16666666666',
        firstName: 'Elaine',
        lastName: 'Bennis',
        familyId: family2Id,
        image: 'https://example.com/image.jpg',
        paused: false,
    },
].map((user) => new User(user));

// export const families = [
//     {
//         id: family1Id,
//         name: 'The Smiths',
//         image: 'https://example.com/image.jpg',
//         paused: false,
//     },
//     {
//         id: family2Id,
//         name: 'The Bennises',
//         image: 'https://example.com/image.jpg',
//         paused: false,
//     },
// ].map((family) => new Family(family));

export const topics = [
    {
        id: 'abcb0a52-baca-4927-b9bd-41c1af23816d',
        familyId: family1Id,
        prompt: 'What is your favorite color?',
        responses: [],
        answeredBy: {},
        completed: false,
    },
].map((topic) => new Topic(topic));
