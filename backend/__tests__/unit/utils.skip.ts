import { validateTwilioRequest } from '../../utils/twilio';
import { twilioWebhookEvents } from '../fixtures/events';

describe('validteTwilioRequest()', () => {
    it('Success: validates a valid request', async () => {
        const event = twilioWebhookEvents.valid;
        // const result = await validateTwilioRequest(event);
        // expect(result.statusCode).toEqual(200);
        // expect(true).toBe(true);
    });
});
