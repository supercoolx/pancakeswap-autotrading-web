import { Link, NavLink } from "react-router-dom";

import NavBar from "./NavBar";
import { useAuth } from "../providers/AuthProvider";

const Header = () => {
  const { isAuthenticatied, logout } = useAuth();

  return (
    <header className="bg-slate-200">
      <div className="container flex items-center justify-between px-4 py-2 mx-auto text-lg">
        <Link to={"/"} className="font-bold">
          App
        </Link>
        <NavBar>
          <div className="space-x-3">
            <NavLink to={'/'}>Home</NavLink>
            <NavLink to={'/trading-view'}>TradingView</NavLink>
          </div>
          { isAuthenticatied && <div className="cursor-pointer" onClick={logout}>Log out</div>}
          { !isAuthenticatied && <div className="space-x-3">
            <NavLink to={'/sign-up'}>Sign Up</NavLink>
            <NavLink to={'/sign-in'}>Sign In</NavLink>
          </div> }
        </NavBar>
      </div>
    </header>
  );
};

export default Header;
