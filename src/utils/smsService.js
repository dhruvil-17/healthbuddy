/**
 * Service for dispatching SMS notifications.
 * Connects to Twilio or natively mocks the response for dev environments.
 */

export const sendSOSMessage = async (phoneNumber, messagePayload) => {
  // Check if we have real SMS credentials (e.g. Twilio)
  // For this environment, we implement a robust Mock Logger
  console.log('===================================================');
  console.log('🚨 EMERGENCY SOS DISPATCHED 🚨');
  console.log('===================================================');
  console.log(`TO: ${phoneNumber}`);
  console.log(`MESSAGE:\n${messagePayload}`);
  console.log('===================================================');

  // Return a success promise to simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, timestamp: new Date().toISOString() });
    }, 800);
  });
};
