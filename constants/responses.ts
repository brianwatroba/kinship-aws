export const RESPONSES = {
    SAVED: (params: { responded: number; total: number }) => `SAVED ✅ | ${params.responded}/ ${params.total}👪`,
    SUMMARY: (params: { summaryLink: string }) => `Answers are in! Today's summary: ${params.summaryLink}`,
    REMINDER: (params: { responded: number; total: number; prompt: string }) =>
        `Your fam is waiting for you! | ${params.responded}/ ${params.total}👪 have answered.\n\n Prompt: "${params.prompt}"`,
    NO_ACTIVE_TOPIC: 'Love the enthusiasm, but there is no active topic right now. Next one is coming soon!',
};
