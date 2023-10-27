import React, {useContext} from "react";
import Divider from "./Divider";
import "./Footer.scss";
import {ThemeContext} from "../contexts/ThemeContext";

import marmot from "../static/marmot-1.png";

const Footer = () => {
  const {theme} = useContext(ThemeContext);
  return (
    <>
      <footer className={`footer ${theme === 'light'?'light':''}`}>
        <Divider>M.BLOG</Divider>
        <div className="footer__content">
          <p className="footer__content__text">
            A simple blog system built with React and firebase. Hope you enjoy
            it! <br/>
            Check more of my portfolio at <a href="https://yuankedev.fun">yuankedev.fun</a>
          </p>
          <img src={marmot} alt="marmot" />
        </div>
      </footer>
    </>
  );
};

export default Footer;
