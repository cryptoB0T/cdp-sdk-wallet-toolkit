import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
// Use viem instead of ethers for parsing ether values
import { parseEther } from "viem";
import { getApiKeys } from '../../lib/api-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract required parameters from request body
  const { 
    smartAccountAddress, 
    network = "base-sepolia", // Default to base-sepolia
    calls,
    paymasterUrl // Optional parameter
  } = req.body;

  // Basic validation
  if (!smartAccountAddress) {
    return res.status(400).json({ error: 'Smart account address is required' });
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

    // Initialize CDP client
    const cdp = new CdpClient({
      apiKeyId,
      apiKeySecret,
      walletSecret,
    });

    // For simplicity, let's hardcode a default call if none provided
    const userCalls = calls || [
      {
        to: "0x0000000000000000000000000000000000000000",
        value: parseEther("0.000001"),
        data: "0x",
      },
    ];

    console.log(`Getting smart account: ${smartAccountAddress}`);
    
    // Use the REST API directly with fetch instead of the SDK
    console.log(`Using direct REST API to send user operation for smart account: ${smartAccountAddress}`);
    
    try {
      // Create API key header using base64 encoding of apiKeyId:apiKeySecret
      const apiKeyHeader = Buffer.from(`${apiKeyId}:${apiKeySecret}`).toString('base64');
      
      // First, we need to create a smart account using the REST API
      console.log('Creating a smart account via REST API...');
      
      // Create a new EVM account first
      console.log('Creating a new EVM account...');
      const evmAccount = await cdp.evm.createAccount();
      console.log('Created EVM account:', evmAccount.address);
      
      // Create smart account using REST API
      const createSmartAccountResponse = await fetch('https://api.cdp.coinbase.com/platform/v2/evm/smart-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${apiKeyHeader}`
        },
        body: JSON.stringify({
          owner_address: evmAccount.address,
          network: network
        })
      });
      
      if (!createSmartAccountResponse.ok) {
        const errorData = await createSmartAccountResponse.json();
        console.error('Error creating smart account via REST API:', errorData);
        return res.status(createSmartAccountResponse.status).json({
          error: 'Failed to create smart account via REST API',
          details: errorData
        });
      }
      
      const smartAccountData = await createSmartAccountResponse.json();
      console.log('Smart account created successfully via REST API:', smartAccountData);
      const smartAccountAddress = smartAccountData.address;
      
      // Now send the user operation using REST API
      console.log(`Sending user operation from: ${smartAccountAddress} on network: ${network}`);
      
      // Prepare the calls for the user operation
      const userOperationEndpoint = `https://api.cdp.coinbase.com/platform/v2/evm/smart-accounts/${smartAccountAddress}/user-operations`;
      
      // Prepare the request body
      const requestBody: any = {
        network: network,
        calls: userCalls,
      };
      
      // Add paymaster URL if provided
      if (paymasterUrl) {
        requestBody.paymaster_url = paymasterUrl;
      }
      
      const sendUserOpResponse = await fetch(userOperationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${apiKeyHeader}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!sendUserOpResponse.ok) {
        const errorData = await sendUserOpResponse.json();
        console.error('Error sending user operation via REST API:', errorData);
        return res.status(sendUserOpResponse.status).json({
          error: 'Failed to send user operation via REST API',
          details: errorData
        });
      }
      
      const userOperationData = await sendUserOpResponse.json();
      console.log('User operation sent successfully via REST API:', userOperationData);
      
      // Return the user operation details
      res.status(200).json({ 
        success: true,
        userOpHash: userOperationData.user_op_hash,
        smartAccountAddress: smartAccountAddress,
        network,
        sentVia: 'REST API'
      });
    } catch (error) {
      console.error('Exception when calling REST API:', error);
      return res.status(500).json({
        error: 'Exception when sending user operation via REST API',
        details: error.message
      });
    }
    
  } catch (error) {
    console.error('Error sending user operation:', error);
    res.status(500).json({ 
      error: 'Failed to send user operation',
      details: error.message 
    });
  }
}
