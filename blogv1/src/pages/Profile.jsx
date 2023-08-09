import React, { useState, useContext, useEffect } from "react";
import "./Profile.scss";
import marmot from "../static/marmot-1.png";
import { AuthContext } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import PostCard from "../components/PostCard";
import Dialogue from "../components/Dialogue";

const Profile = () => {
  const [showEditProfile, setShowEditProfile] = useState(true);
  const [active, setActive] = useState("publish");

  const { currentUser } = useContext(AuthContext);
  const [targetUser, setTargetUser] = useState(null);

  const [posts, setPosts] = useState(null);

  const location = useLocation();
  const targetUserId = location.pathname.split("/")[2];

  const [editProfile, setEditProfile] = useState({
    file: null,
    avatar: "",
    displayName: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const avatarSrc = URL.createObjectURL(file);
    setEditProfile({ ...editProfile, file, avatar: avatarSrc });
  };

  //set target user
  useEffect(() => {
    //fetch user data
    //if params is empty or current user id, then it will be the current user
    if (!targetUserId || targetUserId === currentUser.uid) {
      setTargetUser(currentUser);
      setEditProfile({
        avatar: currentUser.image,
        displayName: currentUser.displayName,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } else {
      //if the params is not empty and the params is not the current user, then it will be the user that we are viewing
      const getUser = async () => {
        try {
          const docSnap = await getDoc(doc(db, "users", targetUserId));
          setTargetUser(docSnap.data());
        } catch (err) {
          console.log(err);
        }
      };
      getUser();
    }
  }, [targetUserId, currentUser]);

  // useEffect(() => {
  //   console.log(targetUser);
  // }, [targetUser]);

  //get posts from target user
  useEffect(() => {
    //fetch posts data
    const getPosts = async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          where("authorId", "==", targetUser.uid)
        );

        const docSnap = await getDocs(q);
        const result = docSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(result);
      } catch (err) {
        console.log(err);
      }
    };

    if (targetUser) {
      getPosts();
      console.log("get posts");
    }
  }, [targetUser]);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  const handlePublishedBtn = () => {
    setActive("publish");
    //set content to published
  };

  const handleDraftsBtn = () => {
    setActive("draft");
    //set content to drafts
  };

  //animation of edit profile
  const splitLabel = (label) => {
    return label.split("").map((char, index) => (
      <span style={{ transitionDelay: `${index * 50}ms` }} key={index}>
        {char === "&" ? "\u00a0" : char}
      </span>
    ));
  };

  return (
    <div className="profile">
      <div className="profile-user-info">
        <img src={marmot} alt="user avatar" />
        <h3>Marmotte</h3>
        {currentUser && <button>Edit & Setting</button>}
      </div>

      {showEditProfile && currentUser && (
        <Dialogue>
          <div className="profile-edit">
            <h3>Edit & Setting</h3>
            <form>
              <fieldset className="fieldset-1">
                <legend>Edit Profile</legend>
                <div className="edit-avatar">
                  <label htmlFor="avatar">
                    <span>Edit</span>
                    <img src={editProfile.avatar || marmot} alt="" />
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="avatar"
                    id="avatar"
                    onChange={handleAvatarChange}
                    hidden
                  />
                </div>
                <div className="edit-inputBox">
                  <input
                  required
                    type="text"
                    name="username"
                    value={editProfile.displayName}
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        displayName: e.target.value,
                      })
                    }
                  />
                  <label>{splitLabel("Display&Name")}</label>
                </div>
              </fieldset>

              <fieldset className="fieldset-2">
                <legend>Change Password</legend>
                <div className="edit-inputBox">
                  <input
                  required
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={editProfile.currentPassword}
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="currentPassword">
                    {splitLabel("Current&Password")}
                  </label>
                </div>

                <div className="edit-inputBox">
                  <input
                  required
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={editProfile.newPassword}
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="newPassword">
                    {splitLabel("New&Password")}
                  </label>
                </div>

                <div className="edit-inputBox">
                  <input
                  required
                    type="password"
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    value={editProfile.confirmNewPassword}
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        confirmNewPassword: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="confirmNewPassword">
                    {splitLabel("Confirm&New&Password")}
                  </label>
                </div>
              </fieldset>
              <button>Save</button>
              <button onClick={() => setShowEditProfile(false)}>Cancel</button>
            </form>
          </div>
        </Dialogue>
      )}

      <div className="profile-user-posts-container">
        <div className="profile-user-posts-header">
          <button
            className={`${active === "publish" ? "active" : ""}`}
            onClick={handlePublishedBtn}
          >
            Published
          </button>
          <button
            className={`${active === "draft" ? "active" : ""}`}
            onClick={handleDraftsBtn}
          >
            Drafts
          </button>
        </div>
        <div className="profile-user-posts">
          {posts &&
            posts
              .filter((post) => post.status === active)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </div>
    </div>
  );
};

export default Profile;
