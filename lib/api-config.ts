
export function getApiKeys() {
  if (typeof window !== 'undefined') {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      const keys = JSON.parse(savedKeys);
      return {
        apiKeyId: keys.CDP_API_KEY_ID,
        apiKeySecret: keys.CDP_API_KEY_SECRET,
        walletSecret: keys.CDP_WALLET_SECRET
      };
    }
  }
  
  // Fallback to environment variables
  return {
    apiKeyId: process.env.CDP_API_KEY_ID,
    apiKeySecret: process.env.CDP_API_KEY_SECRET,
    walletSecret: process.env.CDP_WALLET_SECRET
  };
}
