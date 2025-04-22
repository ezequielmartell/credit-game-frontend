import { useState, useContext, useEffect, useCallback } from "react";
import { Context } from '../utils/Context';
import { usePlaidLink } from "react-plaid-link";

const url = import.meta.env.VITE_APP_URL


const PlaidLinkComponent = () => {
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authTokens, setAuthTokens } = useContext(Context);

  const onSuccess = useCallback(async (publicToken) => {
    setLoading(true);
    await fetch(`${url}/api/exchange_public_token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authTokens.access}`,
      },
      body: JSON.stringify({ public_token: publicToken }),
    });
    // await getBalance();
  }, [authTokens, url]);

  const createLinkToken = useCallback(async () => {
    if (window.location.href.includes("?oauth_state_id=")) {
      const linkToken = localStorage.getItem("link_token");
      setToken(linkToken);
    } else {
      const response = await fetch(`${url}/api/create_link_token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authTokens.access}`,
        }
      }
      );
      const data = await response.json();
      setToken(data.link_token);
      localStorage.setItem("link_token", data.link_token);
    }
  }, [url]);

  //   const getBalance = useCallback(async () => {
  //     setLoading(true);
  //     const response = await fetch(`${url}/api/balance`);
  //     const data = await response.json();
  //     setData(data);
  //     setLoading(false);
  //   }, [url]);

  let isOauth = false;
  const config = { token, onSuccess };

  if (window.location.href.includes("?oauth_state_id=")) {
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (!token) createLinkToken();
    if (isOauth && ready) open();
  }, [token, isOauth, ready, open, createLinkToken]);

  return (
    <div>
      <button onClick={() => open()} disabled={!ready}>
        <strong>Link Plaid account</strong>
      </button>

      {!loading &&
        data &&
        Object.entries(data).map(([key, value], i) => (
          <pre key={i}>
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ))}
    </div>
  );
};

export default PlaidLinkComponent;
