import React, { useContext } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Context } from '../utils/Context';
import { signup, login } from '../utils/Utils';
import Home from "./Home";


function LoginPage() {
    const { password, setPassword } = useContext(Context);
    const { email, setEmail } = useContext(Context);
    const { error, setError } = useContext(Context);
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const { authTokens, setAuthTokens } = useContext(Context);

    let navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || "/";

    // if user loads login page, check if authenticated and direct home if they are
    // if (isAuthenticated) {
    //     return <Navigate to="/" replace />;
    // }
    function handlePassword(e) {
        setPassword(e.target.value);
    }

    function handleEmail(e) {
        setEmail(e.target.value);
    }

    return (
        <div>
            <h1>Credit Gaming Service</h1>
            {/* <h2>Login</h2> */}
            <h3>Please log in to continue</h3>
            <h4>Or sign up below </h4>
            <form>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="text" name="email" value={email} onChange={handleEmail} />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={password} onChange={handlePassword} />
                </div>

                {error &&
                    <div>
                        <small>
                            {error}
                        </small>
                    </div>
                }
                <div className="button-group">
                    <button onClick={(e) => login(e, email, password, setIsAuthenticated, setEmail, setPassword, setError, setAuthTokens, from, navigate)}>Login</button>
                    <button onClick={(e) => signup(e, email, password, setIsAuthenticated, setEmail, setPassword, setError, from, navigate)}>SignUp</button>
                </div>
            </form>
        </div>
    )
}

export default LoginPage;
