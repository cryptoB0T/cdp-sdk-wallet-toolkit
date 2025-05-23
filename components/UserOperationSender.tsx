import { useState } from 'react';
import styles from '../styles/UserOperationSender.module.css';

// Utility function to format value properly
const formatValue = (value: string | number): string => {
  try {
    // If it's already a hex string starting with 0x, return as is
    if (typeof value === 'string' && value.startsWith('0x')) {
      return value;
    }
    
    // Just return the string value for now
    return value.toString();
  } catch (error) {
    console.error('Error formatting value:', error);
    // Return the original value if parsing fails
    return value.toString();
  }
};

type EVMNetwork = 'base-sepolia' | 'base-mainnet';

interface UserOperationSenderProps {
  smartAccountAddress: string;
  network: EVMNetwork;
}

export default function UserOperationSender({ smartAccountAddress, network }: UserOperationSenderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userOpData, setUserOpData] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [useSimpleEndpoint, setUseSimpleEndpoint] = useState(false);
  const [activeSmartAccount, setActiveSmartAccount] = useState(smartAccountAddress);

  const sendUserOperation = async () => {
    if (!userOpData.trim() && !useSimpleEndpoint) {
      setError('Please enter user operation data');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setTransactionHash('');

      // Determine which endpoint to use
      const endpoint = useSimpleEndpoint ? '/api/send-user-operation-simple' : '/api/send-user-operation';
      console.log(`Using endpoint: ${endpoint}`);
      
      let requestBody: any = { smartAccountAddress, network };
      
      // Only parse user operation data if not using the simple endpoint
      if (!useSimpleEndpoint) {
        // Parse the user operation data
        let calls;
        try {
          calls = JSON.parse(userOpData);
          
          // Log the parsed data for debugging
          console.log('Parsed user operation data:', calls);
          
          // Validate the structure
          if (!Array.isArray(calls)) {
            // If it's not an array, wrap it in an array
            calls = [calls];
            console.log('Wrapped in array:', calls);
          }
          
          // Validate each call object
          const isValid = calls.every(call => {
            const hasTo = typeof call.to === 'string' && call.to.startsWith('0x');
            const hasValue = call.value !== undefined;
            const hasData = typeof call.data === 'string';
            
            if (!hasTo || !hasValue || !hasData) {
              console.log('Invalid call object:', call, { hasTo, hasValue, hasData });
              return false;
            }
            return true;
          });
          
          // Format values properly
          calls = calls.map(call => ({
            ...call,
            // Ensure value is properly formatted
            value: call.value.toString(),
            // Ensure data is a hex string
            data: call.data.startsWith('0x') ? call.data : '0x' + call.data
          }));
          
          if (!isValid) {
            setError('Invalid call object format. Each call must have "to" (address), "value" (amount), and "data" properties.');
            setLoading(false);
            return;
          }
          
          // Add calls to request body
          requestBody.calls = calls;
        } catch (err) {
          console.error('JSON parse error:', err);
          setError(`Invalid JSON format: ${err.message}. Please check your input.`);
          setLoading(false);
          return;
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send user operation');
      }

      // Store the transaction hash and user operation hash
      setTransactionHash(data.transactionHash || data.userOpHash);
      setSuccess(`User operation sent successfully! UserOpHash: ${data.userOpHash}`);
      
      // Store the smart account address if it's returned from the API
      if (data.smartAccountAddress) {
        setActiveSmartAccount(data.smartAccountAddress);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while sending the user operation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3>Send User Operation</h3>
      <p>Smart Account: {smartAccountAddress}</p>
      <p>Network: {network}</p>

      <div className={styles.inputGroup}>
        <label htmlFor="userOpData">User Operation Data (JSON format):</label>
        <textarea
          id="userOpData"
          value={userOpData}
          onChange={(e) => setUserOpData(e.target.value)}
          placeholder={`[
  {
    "to": "0x0000000000000000000000000000000000000000",
    "value": "0",
    "data": "0x"
  }
]`}
          className={styles.textarea}
          rows={10}
        />
      </div>
      
      <div className={styles.exampleSection}>
        <h4>Example User Operations:</h4>
        <div className={styles.example}>
          <h5>Simple ETH Transfer (0 value):</h5>
          <pre className={styles.code}>{JSON.stringify([
            {
              to: "0x0000000000000000000000000000000000000000",
              value: "0",
              data: "0x"
            }
          ], null, 2)}</pre>
          <p className={styles.note}>This sends a transaction with 0 ETH to the zero address.</p>
          <button 
            className={styles.exampleButton}
            onClick={() => setUserOpData(JSON.stringify([
              {
                to: "0x0000000000000000000000000000000000000000",
                value: "0",
                data: "0x"
              }
            ], null, 2))}
          >
            Use This Example
          </button>
        </div>
      </div>

      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="useSimpleEndpoint"
          checked={useSimpleEndpoint}
          onChange={(e) => setUseSimpleEndpoint(e.target.checked)}
        />
        <label htmlFor="useSimpleEndpoint">
          Use simplified endpoint (uses default call parameters)
          <span className={styles.tooltipContainer}>
            <span className={styles.tooltipIcon}>?</span>
            <span className={styles.tooltipText}>
              <strong>Technical Note:</strong> The simplified endpoint creates a new EVM account and smart account for each request. 
              This is necessary because:<br/><br/>
              1. Smart accounts require signing capabilities from their owner account<br/>
              2. These signing capabilities must be available in the same session<br/>
              3. When only an address is provided, we cannot retrieve the full account with signing capabilities<br/><br/>
              In a production environment, you would need to implement secure key management to maintain account continuity across sessions.
            </span>
          </span>
        </label>
      </div>

      <button 
        onClick={sendUserOperation} 
        disabled={loading || !smartAccountAddress || (!userOpData.trim() && !useSimpleEndpoint)}
        className={styles.button}
      >
        {loading ? 'Sending...' : useSimpleEndpoint ? 'Send Simple User Operation' : 'Send User Operation'}
      </button>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      
      {transactionHash && (
        <div className={styles.transactionInfo}>
          <p>Transaction Hash: {transactionHash}</p>
          <a 
            href={`https://${network === 'base-mainnet' ? '' : 'sepolia.'}basescan.org/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            View Transaction on Block Explorer
          </a>
        </div>
      )}
      
      {activeSmartAccount && activeSmartAccount !== smartAccountAddress && (
        <div className={styles.transactionInfo}>
          <p>New Smart Account: {activeSmartAccount}</p>
          <a 
            href={`https://${network === 'base-mainnet' ? '' : 'sepolia.'}basescan.org/address/${activeSmartAccount}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            View Smart Account on Block Explorer
          </a>
        </div>
      )}
    </div>
  );
}
