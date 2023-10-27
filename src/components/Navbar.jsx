import React, { useContext } from "react";
import "./Navbar.scss";
import { categories } from "../static/cats";
import { Link } from "react-router-dom";
import Switch from "./Switch";
import { ThemeContext } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import { auth } from "../firebase";

import marmot from "../static/marmot-1.png";

const Navbar = () => {
  const { theme } = useContext(ThemeContext);

  const { currentUser } = useContext(AuthContext);

  return (
    <>
      <nav className={`navbar ${theme === "light" ? "light" : ""}`}>
        <div className="logo">
          <Link to="/" className="logo-link">
            <h1>M.BLOG</h1>
          </Link>
        </div>
        <div className="categories">
          {categories.map((cat) => (
            <Link to={`/?cat=${cat.name}`} className="cat-link" key={cat.id}>
              <span className="cat">{cat.name}</span>
            </Link>
          ))}
          <Link to="/" className="cat-link">
            <span className="cat">All</span>
          </Link>
        </div>
        <Switch />
        <div className="user">
          {!currentUser && (
            <Link to="/auth" className="login-link">
              <span>Login/Register</span>
            </Link>
          )}
          <div className="user-info">
            <img src={currentUser?.photoURL || marmot} alt="user" />
            {currentUser && (
              <div className="dropdown-user">
                <span className="username">{currentUser.displayName}</span>
                <div className="dropdown-user-content">
                  <ul>
                    <li>
                      <i className="fa-solid fa-feather-pointed"></i>
                      <Link to="/write">Write</Link>
                    </li>
                    <li>
                      <i className="fa-solid fa-paw"></i>
                      <Link to="/profile">Profile</Link>
                    </li>
                    <li onClick={() => auth.signOut()}><i className="fa-solid fa-arrow-right-from-bracket"></i>Logout</li>
                    
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
