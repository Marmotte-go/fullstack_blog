import React from "react";
// import { mainPost } from "../static/cats";
import "./Featured.scss";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Featured = () => {
  //fetch featured post
  const [mainPost, setMainPost] = useState({});
  useEffect(() => {
    const getMainPost = async () => {
      try {
        const docSnap = await getDoc(doc(db, "blogs", "44c1819e-c68e-49cd-bfa5-123ce10b6595"));
        const post = {
          id: docSnap.id,
          ...docSnap.data(),
        };
        setMainPost(post);
      } catch (err) {
        console.log(err);
      }
    };
    getMainPost();
  }, []);

  return (
    <div className="featured">
      <div className="featured-img">
        <img src={mainPost.image} alt={mainPost.title} />
      </div>
      <div className="featured-content-container">
        <div className="featured-content">
          <h1>{mainPost.title}</h1>
          <h3>{mainPost.desc}</h3>
          <Link to={`/post/${mainPost.id}`} className="featured-link">
            <span>Continue reading …</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Featured;
