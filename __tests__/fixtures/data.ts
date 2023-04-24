import { User } from '../../models/User';

export const users = [
    {
        phoneNumber: '+12222222222',
        firstName: 'Brian',
        lastName: 'Smith',
        familyId: '8ff23aec-5dab-4e59-bd3a-a654e5e037b8',
        paused: false,
    },
    {
        phoneNumber: '+13333333333',
        firstName: 'Kevin',
        lastName: 'Smith',
        familyId: '8ff23aec-5dab-4e59-bd3a-a654e5e037b8',
        paused: false,
    },
    {
        phoneNumber: '+16666666666',
        firstName: 'Elaine',
        lastName: 'Bennis',
        familyId: '8ff2442c-63af-4485-84ba-5b8c37716e29',
        paused: false,
    },
].map((user) => new User(user));
