// import queryString from 'query-string';
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie"
import React from "react";
const cookies = new Cookies();

const url = import.meta.env.VITE_APP_URL
const fronturl = import.meta.env.VITE_APP_FRONT_URL

export function isResponseOk(response) {
    // console.log(response)
    if (response.status === 204) {
        return { spotifyStatus: "False" }
    } else if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        return response.json().then((errorData) => {
            const error = new Error(errorData.message || "An error occurred");
            return Promise.reject(error);
        });
    }
}


export function login(e, email, password, setIsAuthenticated, setEmail, setPassword, setError, setAuthTokens, from, navigate) {
    e.preventDefault();
    fetch(`${url}/api/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": cookies.get("csrftoken")
        },
        credentials: import.meta.env.PROD ? "same-origin" : "include",
        body: JSON.stringify({ email: email, password: password }),
    })
        .then(isResponseOk)
        .then((data) => {
            console.log(data);
            setIsAuthenticated(true)
            setEmail('')
            setPassword('')
            setError('')
            navigate(from, { replace: true });
            if (data.access) {
                setAuthTokens(data);
                // setUser(JSON.parse(atob(data.access.split('.')[1])));
                localStorage.setItem('authTokens', JSON.stringify(data));
            }
        })
        .catch((err) => {
            setError(err.toString());
            console.log(err);
        })
}

const logout = (setAuthTokens) => {
    console.log('logging out')
    setAuthTokens(null);
    localStorage.removeItem('authTokens');
    window.location.reload();
};

const refreshToken = async (refreshToken, setAuthTokens) => {
    // console.log('refreshing tokens')
    return fetch(`${url}/api/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: import.meta.env.PROD ? "same-origin" : "include",
        body: JSON.stringify({ refresh: refreshToken }),
    })

        .then(isResponseOk)
        .then((data) => {
            // console.log(data);
            if (data.access) {
                // setUser(JSON.parse(atob(data.access.split('.')[1])));
                localStorage.setItem('authTokens', JSON.stringify(data));
                // console.log('new tokens from refreshToken:', data)
                return data;
            }
            return null;
        })
        .catch((err) => {
            // setError(err.toString());
            console.log(err);
            return null;
        })
};

export const updateToken = async (authTokens, setAuthTokens) => {
    // console.log('updating token', authTokens)
    // const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    if (!authTokens?.refresh) {
        console.log('no refresh token', authTokens)
        logout(setAuthTokens);
        return;
    }
    const newTokens = await refreshToken(authTokens.refresh, setAuthTokens);
    // console.log('new tokens', newTokens)
    if (newTokens?.access) {
        setAuthTokens(newTokens);
        localStorage.setItem('authTokens', JSON.stringify(newTokens));
    } else {
        logout(setAuthTokens);
    }
};












// ################################


export function codeAuth(code) {
    fetch(`${url}/api/callback/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: import.meta.env.PROD ? "same-origin" : "include",
        body: JSON.stringify({ code: code }),
    }).then(isResponseOk)
        .then((data) => {
            // console.log(data);
        });
}

export function spotifyAuth() {
    // var state = generateRandomString(16);
    // res.cookie(stateKey, state);
    // your application requests authorization
    var client_id = import.meta.env.VITE_APP_CLIENT_ID;
    var scope = import.meta.env.VITE_APP_SCOPE;
    var redirect_uri = `${fronturl}/callback`;
    var result = 'https://accounts.spotify.com/authorize?'
    return result;
};

export async function fetchArtists(setBadArtistsArray) {

    await fetch(`${url}/api/artists/`, {
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: import.meta.env.PROD ? "same-origin" : "include",
    })
        .then(isResponseOk)
        .then((data) => {
            // console.log(data)
            let array = data.artists
            if (array) {
                array.sort()
                setBadArtistsArray(array)
            }
        })
}

export function appendArtist(e, newArtist, badArtistsArray, setBadArtistsArray) {

    e.preventDefault();
    if (!badArtistsArray.includes(newArtist)) {
        fetch(`${url}/api/artists/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.get("csrftoken"),
            },
            credentials: import.meta.env.PROD ? "same-origin" : "include",
            body: JSON.stringify({ append: newArtist }),
        })
            .then(isResponseOk)
            .then((data) => {
                // console.log(data)
                let array = data.artists
                if (array) {
                    array.sort()
                    setBadArtistsArray(array)
                }
            })
        // if button was from current playing artists, also skip the song
    }
}

export async function removeArtist(e, item, setBadArtistsArray) {

    e.preventDefault();
    await fetch(`${url}/api/artists/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: import.meta.env.PROD ? "same-origin" : "include",
        body: JSON.stringify({ remove: item }),
    })
        .then(isResponseOk)
        .then((data) => {
            // console.log(data)
            let array = data.artists
            if (array) {
                array.sort()
                setBadArtistsArray(array)
            }
        })
}

export function signup(e, email, password, setIsAuthenticated, setEmail, setPassword, setError, from, navigate) {
    e.preventDefault();
    fetch(`${url}/api/signup/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
    })
        .then(isResponseOk)
        .then((data) => {
            // console.log(data);
            setIsAuthenticated(true)
            setEmail('')
            setPassword('')
            setError('')
            navigate(from, { replace: true });
        })
        .catch((err) => {
            setError(err.toString());
            console.log(err);
        })
}
export function getAccessToken(setAccessToken) {

    fetch(`${url}/api/me/`, {
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: import.meta.env.PROD ? "same-origin" : "include",
    })
        .then(isResponseOk)
        .then((data) => {
            // console.log('access token retrieved')
            // console.log(data.data)
            setAccessToken(data.data)
        })
}

export async function pollSpotifyMe(access_token) {
    if (access_token) {
        await fetch("https://api.spotify.com/v1/me", {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${access_token}`,
            }
        })
            .then(isResponseOk)
            .then((data) => {
                // console.log(data)
                // set states
            })
    }
}


export async function pollSpotifyPlayer(access_token, setCurrentAlbumArt, setCurrentArtists, setCurrentSongName, setIsPlaying) {
    if (access_token) {
        await fetch("https://api.spotify.com/v1/me/player", {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${access_token}`,
            }
        })
            .then(isResponseOk)
            .then((data) => {
                if (!data.spotifyStatus) {
                    setCurrentAlbumArt(data.item.album.images[1].url)
                    setCurrentArtists(data.item.artists)
                    setCurrentSongName(data.item.name)
                    setIsPlaying(true)
                }
                // setCurrentSong(data)    
            })
    }
}
// ################################


