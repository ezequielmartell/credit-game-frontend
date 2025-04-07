import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";

import { isResponseOk } from './Utils';
import { Context } from './Context';

const url = import.meta.env.VITE_APP_URL

// export function RequireAuth({ children }) {
//     let location = useLocation();
//     const { isAuthenticated, setIsAuthenticated } = useContext(Context);
//     const { loading, setLoading } = useContext(Context);

//     useEffect(() => { isLoggedin() }, [])

//     async function isLoggedin() {
//         const tokens = localStorage.getItem('authTokens');

//         await fetch(`${url}/api/session/`, {
//             credentials: import.meta.env.PROD ? "same-origin" : "include",
//         })
//             .then(isResponseOk)
//             .then((data) => {
//                 setIsAuthenticated(data.isAuthenticated);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.log(err)
//             });
//     };

//     if (loading) {
//         // Render a loading state while checking authentication
//         return <div>Loading...</div>;
//     }
//     if (!isAuthenticated) {
//         // Redirect them to the /login page, but send 
//         // them where they came from after they login.
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }

//     return children;
// }


// import { AuthContext } from '../context/AuthContext';

const RequireAuth = ({ children }) => {
//   const { user } = useContext(AuthContext);
    let location = useLocation();
    // const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const { loading, setLoading } = useContext(Context);
    const { authTokens, setAuthTokens } = useContext(Context);
    // console.log('authTokens', authTokens)
    if (loading) {
        // Render a loading state while checking authentication
        return <div>Loading...</div>;
    }

  if (!authTokens || Object.keys(authTokens).length === 0) {
        console.log('no auth tokens,  must sign in.')
        return <Navigate to="/login" state={{ from: location }} replace />;
        // return <Navigate to="/login" />;
  }

  return children;
};

export default RequireAuth;