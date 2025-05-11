import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
import { getApiKeys } from '../../lib/api-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract query parameters or body parameters
  const id = req.query.id || req.body.id;

  // Validate policy ID
  if (!id) {
    return res.status(400).json({ error: 'Policy ID is required' });
  }

  try {
    // Get API keys from local storage or environment variables
    const apiKeysResult = getApiKeys();
    const { apiKeyId, apiKeySecret, walletSecret, source } = apiKeysResult;
    
    // Log API keys in a safe way (only showing first few characters)
    console.log('API Key ID (first 8 chars):', apiKeyId ? apiKeyId.substring(0, 8) + '...' : 'undefined');
    console.log('API Key Secret (first 8 chars):', apiKeySecret ? apiKeySecret.substring(0, 8) + '...' : 'undefined');
    console.log('Wallet Secret (first 8 chars):', walletSecret ? walletSecret.substring(0, 8) + '...' : 'undefined');
    console.log('API keys source:', source);
    
    if (!apiKeyId || !apiKeySecret || !walletSecret) {
      console.error('Missing one or more required API keys');
      return res.status(500).json({ 
        error: 'Missing CDP configuration. Please check API keys in settings or environment variables.' 
      });
    }

    const cdp = new CdpClient({
      apiKeyId,
      apiKeySecret,
      walletSecret,
    });

    try {
      console.log(`Deleting policy with ID: ${id}`);
      
      // Call the CDP SDK to delete the policy
      await cdp.policies.deletePolicy({
        id: id.toString()
      });
      
      console.log('Policy deleted successfully');
      
      return res.status(200).json({
        success: true,
        message: 'Policy deleted successfully'
      });
      
    } catch (error) {
      console.error('Policy Deletion Error:', error);
      
      // Check if it's a not found error
      if (error.message && error.message.includes('not found')) {
        return res.status(404).json({ 
          error: 'Policy not found',
          details: error.message 
        });
      }
      
      // Check if it's an in-use error
      if (error.message && (error.message.includes('in use') || error.message.includes('in-use'))) {
        return res.status(400).json({ 
          error: 'Cannot delete policy that is in use by one or more accounts',
          details: error.message 
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to delete policy',
        details: error.message 
      });
    }
  } catch (error) {
    console.error('CDP Client Error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize CDP client',
      details: error.message 
    });
  }
}
