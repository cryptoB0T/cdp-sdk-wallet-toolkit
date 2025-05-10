
import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.query;

  try {
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
    });

    let accounts;
    if (type === 'EVM') {
      const response = await cdp.evm.listAccounts();
      accounts = response.accounts;
      
      // Fetch balances for each account
      const accountsWithBalances = await Promise.all(
        accounts.map(async (account) => {
          console.log('Fetching balances for address:', account.address);
          const balanceResponse = await cdp.evm.listTokenBalances({
            address: account.address,
            network: 'base-sepolia'
          });
          
          // Custom replacer to handle BigInt
          const replacer = (key, value) => 
            typeof value === 'bigint' ? value.toString() : value;
            
          console.log('Balance response:', JSON.stringify(balanceResponse, replacer, 2));
          
          // Initialize balances array
          const balances = [];
          
          // Add native token balance if present
          if (balanceResponse?.nativeToken?.value) {
            console.log('Found native token balance:', balanceResponse.nativeToken.value.toString());
            balances.push({
              currency: 'ETH',
              amount: balanceResponse.nativeToken.value.toString()
            });
          }
          
          // Add token balances if present
          if (balanceResponse?.tokens) {
            balances.push(...balanceResponse.tokens.map(token => ({
              currency: token.symbol || 'Unknown',
              amount: token.value?.toString() || '0'
            })));
          }
          
          // Add other token balances
          if (balanceResponse?.tokens) {
            balances.push(...balanceResponse.tokens.map(balance => ({
              currency: balance.currency || balance.symbol || 'Unknown',
              amount: (balance.amount || '0').toString()
            })));
          }
          
          return {
            ...account,
            balances
          };
        })
      );
      
      res.status(200).json({ accounts: accountsWithBalances });
    } else if (type === 'SOLANA') {
      const response = await cdp.solana.listAccounts();
      accounts = response.accounts;
      
      // Fetch balances for each account
      const accountsWithBalances = await Promise.all(
        accounts.map(async (account) => {
          const balances = await cdp.solana.listTokenBalances({
            address: account.address,
            network: 'solana-devnet'
          });
          return {
            ...account,
            balances
          };
        })
      );
      
      res.status(200).json({ accounts: accountsWithBalances });
    } else {
      return res.status(400).json({ error: 'Invalid wallet type' });
    }
  } catch (error: any) {
    console.error('List accounts error:', error);
    res.status(500).json({ 
      error: 'Failed to list accounts',
      details: error.message || 'Unknown error occurred'
    });
  }
}
