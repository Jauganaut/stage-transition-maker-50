/**
 * Utility functions for URL parameter handling
 */

/**
 * Decodes a base64 encoded string safely
 * @param encoded - Base64 encoded string
 * @returns Decoded string or null if invalid
 */
export const decodeBase64 = (encoded: string): string | null => {
  try {
    return atob(encoded);
  } catch (error) {
    console.warn('Invalid base64 string:', error);
    return null;
  }
};

/**
 * Extracts and decodes email from URL parameters
 * @returns Decoded email or null if not found/invalid
 */
export const getEmailFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedEmail = urlParams.get('tokenid');
  
  if (!encodedEmail) {
    return null;
  }
  
  const decodedEmail = decodeBase64(encodedEmail);
  
  // Basic email validation
  if (decodedEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(decodedEmail)) {
    return decodedEmail;
  }
  
  return null;
};