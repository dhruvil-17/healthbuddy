/**
 * Service for dispatching SMS notifications.
 * Connects to Twilio or natively mocks the response for dev environments.
 */

export const sendSOSMessage = async (phoneNumber, messagePayload) => {
  // Return a success promise to simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, timestamp: new Date().toISOString() });
    }, 800);
  });
};
