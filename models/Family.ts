// import dynamoose from 'dynamoose';
// import { v4 as uuidv4 } from 'uuid';

// const FamilySchema = new dynamoose.Schema(
//     {
//         id: {
//             type: String,
//             hashKey: true,
//             default: uuidv4(),
//         },
//         name: {
//             type: String,
//             required: true,
//         },
//         image: {
//             type: String,
//             required: true,
//         },
//         paused: {
//             type: Boolean,
//             default: false,
//         },
//     },
//     { timestamps: true },
// );

// export const Family = dynamoose.model('Families', FamilySchema);
