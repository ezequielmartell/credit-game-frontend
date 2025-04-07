// Context.js
import React, { useState, useEffect, useRef } from "react";
import { updateToken } from './Utils';


export const Context = React.createContext();

export const ContextProvider = ({ children }) => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [boycottState, setBoycottState] = useState(false);
    const [badArtistsArray, setBadArtistsArray] = useState(['']);
    const [newArtist, setNewArtists] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [authTokens, setAuthTokens] = useState({});

    useEffect(() => {
        const localStorageTokens = localStorage.getItem('authTokens');
        // validTokens(localStorageTokens, setIsAuthenticated)
        if (localStorageTokens) {
            setIsAuthenticated(true);
            setAuthTokens(JSON.parse(localStorageTokens));
        }
        setLoading(false);
    }, []);

    const tokenRef = useRef(authTokens);
    useEffect(() => {
        tokenRef.current = authTokens;
        // console.log('tokenRef.current:', tokenRef.current);
        // console.log('authTokens:', authTokens);
      }, [authTokens]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('refreshing token if available', tokenRef.current);
            if (Object.keys(tokenRef.current).length) {
                // console.log('running through refresh token functions');
                updateToken(tokenRef.current, setAuthTokens);
            }
        // }, 1000 * 60 * 5); // 5 mins
    }, 1000 * 10); // 5 secs
    
        return () => clearInterval(interval);
    }, []);

    return (
        <Context.Provider value={{
            password, setPassword,
            email, setEmail,
            error, setError,
            isAuthenticated, setIsAuthenticated,
            boycottState, setBoycottState,
            badArtistsArray, setBadArtistsArray,
            newArtist, setNewArtists,
            accessToken, setAccessToken,
            loading, setLoading,
            authTokens, setAuthTokens
        }}>
            {children}
        </Context.Provider>
    );
};
