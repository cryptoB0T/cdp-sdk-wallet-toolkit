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

  const sendUserOperation = async () => {
    if (!userOpData.trim()) {
      setError('Please enter user operation data');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setTransactionHash('');

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
      } catch (err) {
        console.error('JSON parse error:', err);
        setError(`Invalid JSON format: ${err.message}. Please check your input.`);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/send-user-operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          smartAccountAddress,
          calls,
          network
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send user operation');
      }

      setTransactionHash(data.transactionHash);
      setSuccess(`User operation sent successfully! Status: ${data.status}`);
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

      <button 
        onClick={sendUserOperation} 
        disabled={loading || !smartAccountAddress}
        className={styles.button}
      >
        {loading ? 'Sending...' : 'Send User Operation'}
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
            View on Block Explorer
          </a>
        </div>
      )}
    </div>
  );
}
