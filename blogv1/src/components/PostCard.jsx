import React, {useContext} from "react";
import './PostCard.scss';

import { ThemeContext } from "../contexts/ThemeContext";

import { Link } from "react-router-dom";
import marmot from '../static/marmot-1.png';


const PostCard = ({post}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <div className={`postcard ${theme === 'light' ? 'light' : ''}`} >
      <div className="postcard-img">
        <img src={post.image} alt={post.title} />
      </div>

      <div className="postcard-content">

        <div className="postcard-author">
          <img src={marmot} alt="" />
          <Link to={`/profile/${post.authorId}`}>
            <span>{post.author}</span>
          </Link>
        </div>

        <Link to={`/post/${post.id}`}>
          <h2 className="postcard-title">{post.title}</h2>
        </Link>

        <p className="postcard-desc">{post.desc}</p>

        <div className="postcard-info">
          <span className="postcard-created-at">{post.createdAt.toDate().toLocaleString()}</span>
          <Link to={`/?cat=${post.category}`} className="postcard-cat">
            {post.category}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PostCard;
