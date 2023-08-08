import React from "react";
import "./Dialogue.scss";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const Dialogue = ({children}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <div className={`dialogue-container ${theme === 'light' ? 'light' : ''}`}>
      <div className="dialogue">
        {children}
      </div>
    </div>
  );
};

export default Dialogue;
