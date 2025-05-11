
export function getApiKeys() {
  if (typeof window !== 'undefined') {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      const keys = JSON.parse(savedKeys);
      return {
        apiKey: keys.COINBASE_API_KEY,
        apiSecret: keys.COINBASE_API_SECRET
      };
    }
  }
  
  // Fallback to environment variables
  return {
    apiKey: process.env.COINBASE_API_KEY,
    apiSecret: process.env.COINBASE_API_SECRET
  };
}
