import { useState, useEffect, useContext } from 'react';
import { Context } from '../utils/Context';
import './PlaidAccountsList.css';

const PlaidAccountsList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authTokens, accounts, setAccounts } = useContext(Context);
  const url = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`${url}/api/plaidstuff/`, {
          headers: {
            'Authorization': `Bearer ${authTokens.access}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }
        
        const data = await response.json();
        
        // Transform the data before storing it in state
        const transformedAccounts = data.reduce((acc, item) => {
            return [...acc, ...item.connection_data.map(account => ({
              ...account,
              institution: item.institution
            }))];
        }, []);
        
        setAccounts(transformedAccounts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [url, authTokens, setAccounts]);

  if (loading) return <div className="text-center p-4">Loading accounts...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  if (accounts.length === 0) return <div className="text-center p-4">No accounts connected yet.</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toProperCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  return (
    <div className="plaid-accounts-list">
      <h2>Connected Accounts</h2>
      <div className="accounts-grid">
        {accounts.map((account, index) => (
          <div key={index} className="account-card">
            <div className="institution">{account.institution}</div>
            <h3>{account.name}</h3>
            <div className="balance">
              <span>Current Balance: </span>
              ${account.balances.current?.toFixed(2) || '0.00'}
            </div>
            {account.balances.limit && (
              <div className="credit-limit">
                <span>Credit Limit: </span>
                ${account.balances.limit.toFixed(2)}
              </div>
            )}
            {account.type === 'credit' && account.aprs && (
              <div className="aprs">
                <h4>Interest Rates:</h4>
                {account.aprs.map((apr, idx) => (
                  <div key={idx} className="apr-item">
                    <span className="apr-type">{toProperCase(apr.apr_type.replace('_', ' '))}: </span>
                    <span className="apr-percentage">{(apr.apr_percentage).toFixed(2)}%</span>
                    {apr.balance_subject_to_apr > 0 && (
                      <span className="apr-balance"> (${apr.balance_subject_to_apr.toFixed(2)})</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {account.next_payment_due_date && (
              <div className="payment-info">
                <div className="next-payment">
                  <span>Next Payment Due: </span>
                  {formatDate(account.next_payment_due_date)}
                </div>
                {account.minimum_payment_amount && (
                  <div className="minimum-payment">
                    <span>Minimum Payment: </span>
                    ${account.minimum_payment_amount.toFixed(2)}
                  </div>
                )}
              </div>
            )}
            <div className="official-name">
              {account.official_name || account.name}
            </div>
          </div>
        ))}
      </div>
      {/* <div>{JSON.stringify(accounts)}</div> */}
    </div>
  );
};

export default PlaidAccountsList; 