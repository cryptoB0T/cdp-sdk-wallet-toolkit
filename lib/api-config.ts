
export function getApiKeys() {
  // Check if we're in the browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // For server-side API routes
  if (!isBrowser) {
    console.log('Running in server environment, using environment variables for API keys');
    
    // Verify all required keys are present
    if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET || !process.env.CDP_WALLET_SECRET) {
      console.warn('Warning: One or more CDP environment variables are missing');
    }
    
    return {
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
      source: 'environment'
    };
  }
  
  // For client-side code
  const savedKeys = localStorage.getItem('apiKeys');
  if (savedKeys) {
    console.log('Found API keys in localStorage');
    try {
      const keys = JSON.parse(savedKeys);
      
      // Verify all required keys are present in localStorage
      if (!keys.CDP_API_KEY_ID || !keys.CDP_API_KEY_SECRET || !keys.CDP_WALLET_SECRET) {
        console.warn('Warning: One or more CDP keys are missing from localStorage');
      }
      
      return {
        apiKeyId: keys.CDP_API_KEY_ID,
        apiKeySecret: keys.CDP_API_KEY_SECRET,
        walletSecret: keys.CDP_WALLET_SECRET,
        source: 'localStorage'
      };
    } catch (error) {
      console.error('Error parsing API keys from localStorage:', error);
    }
  }
  
  // Client-side should only use public keys or make API calls to server endpoints
  // that handle the authentication with private keys
  console.log('No API keys in localStorage, client-side has limited access');
  return {
    apiKeyId: process.env.NEXT_PUBLIC_CDP_API_KEY_ID,
    apiKeySecret: undefined, // Not available client-side for security
    walletSecret: undefined, // Not available client-side for security
    source: 'client-environment'
  };
}
