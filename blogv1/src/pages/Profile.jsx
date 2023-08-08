import React, { useState, useContext, useEffect } from "react";
import "./Profile.scss";
import marmot from "../static/marmot-1.png";
import { AuthContext } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import PostCard from "../components/PostCard";

const Profile = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [active, setActive] = useState("publish");

  const { currentUser } = useContext(AuthContext);
  const [targetUser, setTargetUser] = useState(null);

  const [posts, setPosts] = useState(null);

  const location = useLocation();
  const targetUserId = location.pathname.split("/")[2];

  //set target user
  useEffect(() => {
    //fetch user data
    //if params is empty or current user id, then it will be the current user
    if (!targetUserId || targetUserId === currentUser.uid) {
      setTargetUser(currentUser);
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

  useEffect(() => {
    console.log(targetUser);
  }, [targetUser]);

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

  return (
    <div className="profile">
      <div className="profile-user-info">
        <img src={marmot} alt="user avatar" />
        <h3>Marmotte</h3>
        {currentUser && <button>Edit & Setting</button>}
      </div>

      {showEditProfile && (
        <div className="profile-edit-container">
          <div className="profile-edit">
            <h3>Edit & Setting</h3>
            <form>
              <fieldset>
                <legend>Edit Profile</legend>
                <label htmlFor="displayName">Display Name</label>
                <input type="text" name="displayName" id="displayName" />
                <label htmlFor="avatar">Avatar</label>
                <input type="file" name="avatar" id="avatar" />
                <input type="submit" value="Save" />
              </fieldset>
              <fieldset>
                <legend>Change Password</legend>
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                />
                <label htmlFor="newPassword">New Password</label>
                <input type="password" name="newPassword" id="newPassword" />
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                />
                <input type="submit" value="Save" />
              </fieldset>
              <button onClick={() => setShowEditProfile(false)}>Cancel</button>
            </form>
          </div>
        </div>
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
          {posts && posts.filter((post) => post.status === active).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
