import React from "react";
import { mainPost } from "../static/cats";
import "./Featured.scss";
import { Link } from "react-router-dom";

const Featured = () => {
  return (
    <div className="featured">
      <div className="featured-img">
        <img src={mainPost.image} alt={mainPost.title} />
      </div>
      <div className="featured-content-container">
        <div className="featured-content">
          <h1>{mainPost.title}</h1>
          <h3>{mainPost.description}</h3>
          <Link to={mainPost.link} className="featured-link">
            <span>{mainPost.linkText}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Featured;
