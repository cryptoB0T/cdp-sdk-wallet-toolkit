import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";

// Helper function to format token amounts with proper decimals
function formatAmount(amount: string, decimals: number): string {
  if (!amount) return '0';
  
  // Convert to a decimal string
  const amountBN = BigInt(amount);
  const divisor = BigInt(10) ** BigInt(decimals);
  
  if (amountBN === BigInt(0)) return '0';
  
  // Integer part
  const integerPart = (amountBN / divisor).toString();
  
  // Fractional part (if any)
  const remainder = amountBN % divisor;
  if (remainder === BigInt(0)) return integerPart;
  
  let fractionalPart = remainder.toString().padStart(decimals, '0');
  // Remove trailing zeros
  fractionalPart = fractionalPart.replace(/0+$/, '');
  
  return `${integerPart}.${fractionalPart}`;
}

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

    // Custom replacer for BigInt serialization
    const safeJsonReplacer = (key: string, value: any) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    };

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

          console.log('Balance response:', JSON.stringify(balanceResponse, safeJsonReplacer, 2));

          // Initialize balances array
          const balances = [];

          // Process balances from the response format
          if (balanceResponse?.balances && balanceResponse.balances.length > 0) {
            balanceResponse.balances.forEach(balanceItem => {
              // Check if this is a native token (ETH)
              const isNativeToken = balanceItem.token?.contractAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
              
              // Format the balance with proper decimals
              const rawAmount = balanceItem.amount?.amount || '0';
              // Convert decimals to string before parsing to handle bigint type
              const decimalsStr = String(balanceItem.amount?.decimals || '18');
              const decimals = parseInt(decimalsStr, 10);
              
              // Add to balances array
              balances.push({
                currency: isNativeToken ? 'ETH' : (balanceItem.token?.symbol || 'Unknown'),
                amount: rawAmount,
                formattedAmount: formatAmount(rawAmount.toString(), decimals)
              });
            });
          }

          return {
            ...account,
            balances
          };
        })
      );

      // Serialize and then parse to ensure all BigInt values are converted to strings
      const safeAccounts = JSON.parse(JSON.stringify(accountsWithBalances, safeJsonReplacer));
      res.status(200).json({ accounts: safeAccounts });
    } else if (type === 'SOLANA') {
      const response = await cdp.solana.listAccounts();
      accounts = response.accounts;

      // Fetch balances for each account
      const accountsWithBalances = await Promise.all(
        accounts.map(async (account) => {
          // For Solana, we'll just return the account for now since listTokenBalances isn't available
          // This can be implemented when the proper method is available
          return {
            ...account,
            balances: []
          };
        })
      );

      // Serialize and then parse to ensure all BigInt values are converted to strings
      const safeAccounts = JSON.parse(JSON.stringify(accountsWithBalances, safeJsonReplacer));
      res.status(200).json({ accounts: safeAccounts });
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
