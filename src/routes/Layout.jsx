import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";
import { Context } from '../utils/Context';
import Button from "../components/Button";
import { logout } from '../utils/Utils';
import PlaidLinkComponent from "../components/PlaidLinkComponent";
import ManualAccountForm from "../components/ManualAccountForm";


function Layout() {
  const { authTokens, setAuthTokens } = useContext(Context);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  let loggedinnavbuttons;
  if (isAuthenticated) {
    loggedinnavbuttons = (
      <>
        <PlaidLinkComponent/>
        <ManualAccountForm />
        <Button onClick={() => logout(setAuthTokens, setIsAuthenticated)} variant="danger">Logout</Button>
      </>
    )
  }
  return (
    <>
      <nav>
        {loggedinnavbuttons}
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;
