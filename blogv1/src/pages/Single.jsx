import "./Single.scss";
import { useEffect, useState, useContext, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
// import { posts } from "../static/cats";
import parse from "html-react-parser";

import marmot from "../static/marmot-1.png";
import Dialogue from "../components/Dialogue";
import { ThemeContext } from "../contexts/ThemeContext";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";

import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import { generateHTML } from "@tiptap/html";

const Single = () => {
  const { theme } = useContext(ThemeContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [showDialogue, setShowDialogue] = useState(false);

  const handleDelete = () => {
    //do something to delete it in the backend
    //then navigate to the home page
    navigate("/");
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [location]);

  const postId = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const [output, setOutput] = useState("");

  //get post
  useEffect(() => {
    const getPost = async () => {
      try {
        const docSnap = await getDoc(doc(db, "blogs", postId));
        const post = {
          id: docSnap.id,
          ...docSnap.data(),
        };
        setPost(post);
      } catch (err) {
        console.log(err);
      }
    };

    if (postId) {
      getPost();
    }
  }, [postId]);

  useEffect(() => {
    if (post.id) {
      const temp = generateHTML(post.content, [
        StarterKit,
        Underline,
        Highlight,
        Image,
      ]);
      setOutput(temp);
    }
  }, [post]);

  return (
    <div className={`single ${theme === "light" ? "light" : ""}`}>
      <div className="singleWrapper">
        {post.image && <img src={post.image} alt="" className="singleImg" />}
        <h1 className="singleTitle">{post.title}</h1>
        <div className="singleInfo">
          <div className="singleInfo-author">
            <img src={marmot} alt="" />
            <Link to={`/profile/${post.authorId}`}>
              <span>{post.author}</span>
            </Link>
          </div>
          <span className="postcard-created-at">
            {post.createdAt?.toDate().toLocaleString()}
          </span>
          <div className="singleEdit-icons">
            <Link to={`/edit/${post.id}`}>
              <i className="singleIcon far fa-edit"></i>
            </Link>
            <i
              className="singleIcon far fa-trash-alt"
              onClick={() => setShowDialogue(true)}
            ></i>
          </div>
        </div>
        <div className="singleContent">{parse(output)}</div>
      </div>
      {showDialogue && (
        <Dialogue>
          <div className="dialogue-wrapper">
            <h3>Delete this blog?</h3>
            <p>
              Are you sure you want to delete this blog? This action is not
              reversible.
            </p>
            <div className="deleteBtns">
              <button
                className="deleteBtn"
                onClick={() => setShowDialogue(false)}
                autoFocus
              >
                Cancel
              </button>
              <button className="deleteBtn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </Dialogue>
      )}
    </div>
  );
};

export default Single;
