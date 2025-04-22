// Context.js
import { useState, useEffect, useRef, createContext, useContext } from "react";
import { updateToken } from './Utils';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [boycottState, setBoycottState] = useState(false);
    const [badArtistsArray, setBadArtistsArray] = useState(['']);
    const [newArtist, setNewArtists] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [authTokens, setAuthTokens] = useState({});
    const [linkToken, setLinkToken] = useState('');
    const [accounts, setAccounts] = useState([]);
    // const { linkSuccess, setLinkSuccess } = useState(false);
    

    useEffect(() => {
        const localStorageTokens = localStorage.getItem('authTokens');
        // validTokens(localStorageTokens, setIsAuthenticated)
        if (localStorageTokens) {
            setIsAuthenticated(true);
            setAuthTokens(JSON.parse(localStorageTokens));
        }
        setLoading(false);
    }, []);

    // This was added to keep track of the authTokens in the interval function
    // However, it does not appear to be working, the last set of tokens is kept instead for use
    // and the server was blacklisting the old ones
    // so every refresh was immediately blacklisting the old tokens
    // which were still being used by authTokens
    const tokenRef = useRef(authTokens);
    useEffect(() => {
        tokenRef.current = authTokens;
        // console.log('tokenRef.current:', tokenRef.current);
        // console.log('authTokens:', authTokens);
      }, [authTokens]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('refreshing token if available');
            if (Object.keys(tokenRef.current).length) {
                // console.log('running through refresh token functions');
                updateToken(tokenRef.current, setIsAuthenticated, setAuthTokens);
            }
        }, 1000 * 60 * 5); // 5 mins
    // }, 1000 * 10); // 5 secs
    
        return () => clearInterval(interval);
    }, []);

    return (
        <Context.Provider value={{
            email, setEmail,
            password, setPassword,
            error, setError,
            isAuthenticated, setIsAuthenticated,
            boycottState, setBoycottState,
            badArtistsArray, setBadArtistsArray,
            newArtist, setNewArtists,
            accessToken, setAccessToken,
            loading, setLoading,
            authTokens, setAuthTokens,
            linkToken, setLinkToken,
            accounts, setAccounts
        }}>
            {children}
            {
                // <div>
                // <h1>Context</h1>
                // <p>REF: {JSON.stringify(tokenRef.current)}</p>
                // <p>AUTH: {JSON.stringify(authTokens)}</p>
                // </div>
            }
        </Context.Provider>
    );
};
