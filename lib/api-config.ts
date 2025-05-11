
export function getApiKeys() {
  // Check if we're in the browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // For server-side API routes
  if (!isBrowser) {
    console.log('Running in server environment, using environment variables for API keys');
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
  
  // Fallback to environment variables for client-side
  console.log('No API keys in localStorage, using environment variables');
  return {
    apiKeyId: process.env.NEXT_PUBLIC_CDP_API_KEY_ID, // Use NEXT_PUBLIC_ prefix for client-side
    apiKeySecret: process.env.CDP_API_KEY_SECRET, // This won't be available client-side
    walletSecret: process.env.CDP_WALLET_SECRET, // This won't be available client-side
    source: 'environment'
  };
}
