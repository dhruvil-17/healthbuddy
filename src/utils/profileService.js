/**
 * Service for managing user profiles via secure API routes.
 * This ensures session validation and prevents IDOR vulnerabilities.
 */

export const getUserProfile = async () => {
  try {
    const response = await fetch('/api/profile');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');
    return data.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update profile');
    return data.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const createUserProfile = async (profileData) => {
  // Aliasing to updateUserProfile since the API handles both via upsert
  return updateUserProfile(profileData);
};