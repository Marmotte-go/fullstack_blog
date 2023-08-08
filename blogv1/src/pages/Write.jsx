import "./Write.scss";

import { useContext, useState, useEffect } from "react";
import { categories } from "../static/cats";
import { ThemeContext } from "../contexts/ThemeContext";

import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { db, storage } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { v4 as uuid } from "uuid";

import Select from "../components/Select";
import Tiptap from "./Tiptap";
import Dialogue from "../components/Dialogue";

const Write = () => {
  //day and night mode shift
  const { theme } = useContext(ThemeContext);
  //current user
  const { currentUser } = useContext(AuthContext);

  //post input state
  const [inputPost, setInputPost] = useState({
    postId: uuid(),
    title: "",
    desc: "",
    image: "",
    category: "",
  });
  const [jsonContent, setJsonContent] = useState(null);
  const [fetchContent, setFetchContent] = useState(null);
  const [tempImg, setTempImg] = useState(
    "https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2378&q=80"
  );

  const [error, setError] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);

  //navigate
  const navigate = useNavigate();
  const location = useLocation();
  const postId = location.pathname.split("/")[2];

  //get post data if edit
  useEffect(() => {
    if (postId) {
      const getPost = async () => {
        try {
          const docSnap = await getDoc(doc(db, "blogs", postId));
          const post = {
            id: docSnap.id,
            ...docSnap.data(),
          };
          setInputPost({
            postId: post.id,
            title: post.title,
            desc: post.desc,
            image: post.image,
            category: post.category,
          });
          setFetchContent(post.content);
          setJsonContent(post.content);
          setTempImg(post.image);
        } catch (err) {
          console.log(err);
        }
      };
      getPost();
    }
  }, [postId]);


  const uploadImageCallBack = async (file) => {
    //upload image to storage
    const postImgRef = ref(
      storage,
      `post_images/${inputPost.postId}/${file.name}`
    );

    // Upload the image and wait for it to complete
    const snapshot = await uploadBytesResumable(postImgRef, file);

    // Get the download URL and return it
    return await getDownloadURL(snapshot.ref);
  };

  const uploadCoverImage = async (event) => {
    const file = event.target.files[0];
    //set temp image
    setTempImg(URL.createObjectURL(file));
    //upload image to storage
    const coverImgUrl = await uploadImageCallBack(file);
    //set cover image
    setInputPost({ ...inputPost, image: coverImgUrl });
    return;
  };

  const handleDraft = () => {
    handleSendPost("draft");
  };

  const handlePublish = () => {
    handleSendPost("publish");
  };

  // handle send post
  const handleSendPost = async (status) => {
    setError(null);
    setOpenAlert(false);
    console.log(status)
    if (inputPost.title.length < 1 || jsonContent === null) {
      setError("Please fill in title and content");
      setOpenAlert(true);
      return;
    }
    try {
      const res = await getDoc(doc(db, "blogs", inputPost.postId));
      //if post exists, update it
      if (res.exists()) {
        await setDoc(
          doc(db, "blogs", inputPost.postId),
          {
            title: inputPost.title,
            desc: inputPost.desc,
            content: jsonContent,
            category: inputPost.category,
            status: status,
            createdAt: serverTimestamp(),
            image: inputPost.image,
          },
          { merge: true }
        );
      } else {
        //if post does not exist, create it
        //write post to db
        await setDoc(doc(db, "blogs", inputPost.postId), {
          title: inputPost.title,
          desc: inputPost.desc,
          content: jsonContent,
          image: inputPost.image,
          category: inputPost.category,
          author: currentUser.displayName,
          authorId: currentUser.uid,
          authorAvatar: currentUser.photoURL,
          status: status,
          createdAt: serverTimestamp(),
        });
      }

      if (status === "draft") {
        setOpenAlert(true);
        setError("Saved as draft, you can check in your profile");
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        setOpenAlert(true);
        setError("Published, you can check in home page");
        setTimeout(() => {
        navigate("/");
        }, 2000);
      }
    } catch (err) {
      console.log(err);
      setOpenAlert(true);
      setError(err.message);
    }
  };

  return (
    <div className={`write ${theme === "light" ? "light" : ""}`}>
      <div className="write-wrapper">
        <div className="editor">
          <input
            type="text"
            id="editor-title"
            placeholder="Write a good title here"
            value={inputPost.title}
            onChange={(e) =>
              setInputPost({ ...inputPost, title: e.target.value })
            }
          />
          <textarea
            id="editor-desc"
            placeholder="Write a short description here (200 characters)"
            maxLength="200"
            value={inputPost.desc}
            onChange={(e) =>
              setInputPost({ ...inputPost, desc: e.target.value })
            }
          />
          <Tiptap
            uploadImage={uploadImageCallBack}
            content = {fetchContent}
            setJsonContent={setJsonContent}
          />
        </div>
        <div className="sidebar">
          <div className="image-preview">
            <div className="image-preview-container">
              <img src={tempImg} alt="preview" />
              <span>Preview</span>
            </div>
            <input type="file" id="upload" hidden onChange={uploadCoverImage} />
            <label htmlFor="upload">Upload Cover Image</label>
          </div>

          <div className="category-options">
            <Select
              label="Category"
              options={categories}
              value={inputPost.category}
              onChange={(value) =>
                setInputPost({ ...inputPost, category: value })
              }
            />
          </div>

          <div className="publish-btns">
            <button className="draft-btn" onClick={handleDraft}>
              <i className="fa-regular fa-pen-to-square"></i> Save Draft
            </button>
            <button className="publish-btn" onClick={handlePublish}>
              <i className="fa-solid fa-upload"></i> Publish
            </button>
          </div>
        </div>
      </div>
      {openAlert && (
        <Dialogue>
          <div className="warning">
            <p>{error}</p>
            <button
              className="confirmBtn"
              onClick={() => setOpenAlert(false)}
              autoFocus
            >
              Confirm
            </button>
          </div>
        </Dialogue>
      )}
    </div>
  );
};

export default Write;
