import { User } from '../../models/User';
import { Family } from '../../models/Family';
import { Topic } from '../../models/Topic';

const family1Id = '8ff23aec-5dab-4e59-bd3a-a654e5e037b8';
const family2Id = '8ff2442c-63af-4485-84ba-5b8c37716e29';

export const users = [
    {
        phoneNumber: '+12222222222',
        firstName: 'Brian',
        lastName: 'Smith',
        familyId: family1Id,
        image: 'https://example.com/image.jpg',
        paused: false,
    },
    {
        phoneNumber: '+13333333333',
        firstName: 'Kevin',
        lastName: 'Smith',
        familyId: family1Id,
        image: 'https://example.com/image.jpg',
        paused: false,
    },
    {
        phoneNumber: '+16666666666',
        firstName: 'Elaine',
        lastName: 'Bennis',
        familyId: family2Id,
        image: 'https://example.com/image.jpg',
        paused: false,
    },
].map((user) => new User(user));

export const families = [
    {
        id: family1Id,
        name: 'The Smiths',
        image: 'https://example.com/image.jpg',
        paused: false,
    },
    {
        id: family2Id,
        name: 'The Bennises',
        image: 'https://example.com/image.jpg',
        paused: false,
    },
].map((family) => new Family(family));

export const topics = [
    {
        familyId: family1Id,
        prompt: 'What is your favorite color?',
        responses: [],
        answeredBy: {},
        completed: false,
    },
].map((topic) => new Topic(topic));
