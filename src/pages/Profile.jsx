import React, { useState, useContext, useEffect } from "react";
import "./Profile.scss";
import marmot from "../static/marmot-1.png";
import { updateProfile } from "firebase/auth";
import { AuthContext } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import PostCard from "../components/PostCard";
import Dialogue from "../components/Dialogue";
import { ThemeContext } from "../contexts/ThemeContext";

const Profile = () => {
  const {theme} = useContext(ThemeContext);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [active, setActive] = useState("publish");

  const { currentUser } = useContext(AuthContext);
  const [targetUser, setTargetUser] = useState(null);

  const [posts, setPosts] = useState(null);

  const location = useLocation();
  const targetUserId = location.pathname.split("/")[2];

  const navigate = useNavigate();

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
    console.log(file);
    const avatarSrc = URL.createObjectURL(file);
    setEditProfile({ ...editProfile, file, avatar: avatarSrc });
  };

  const initializeEditProfile = () => {
    if (currentUser) {
      setEditProfile({
        ...editProfile,
        avatar: currentUser.photoURL ? currentUser.photoURL : marmot,
        displayName: currentUser.displayName,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setShowEditProfile(true);
    }
  };

  useEffect(() => {
    const fetchTargetUser = async () => {
      if (!currentUser && !targetUserId) {
        navigate("/");
        return;
      }
      if (currentUser && (!targetUserId || targetUserId === currentUser?.uid)) {
        // Fetch current user's data
        setTargetUser(currentUser);
      } else {
        // Fetch target user's data
        try {
          const docSnap = await getDoc(doc(db, "users", targetUserId));
          setTargetUser(docSnap.data());
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchTargetUser();
  }, [targetUserId, currentUser, navigate]);

  const handleEditProfile = async () => {
    //update profile
    try {
      if (editProfile.file) {
        //upload avatar
        const avatarRef = ref(
          storage,
          `user_profiles/${targetUser.uid}/${editProfile.file.name}}`
        );
        const snapshot = await uploadBytesResumable(
          avatarRef,
          editProfile.file
        );
        const avatarUrl = await getDownloadURL(snapshot.ref);
        //update profile
        await updateProfile(auth.currentUser, {
          displayName: editProfile.displayName,
          photoURL: avatarUrl,
        });
        //update user in database
        await updateDoc(doc(db, "users", targetUser.uid), {
          displayName: editProfile.displayName,
          photoURL: avatarUrl,
        });
      } else {
        //update profile
        await updateProfile(auth.currentUser, {
          displayName: editProfile.displayName,
        });
        //update user in database
        await updateDoc(doc(db, "users", targetUser.uid), {
          displayName: editProfile.displayName,
        });
      }
      setShowEditProfile(false);
    } catch (err) {
      console.log(err);
    }
  };

  // const handleChangePassword = async () => {
  //   //change password
  //   try {
  //     //re-authenticate
  //     //update password
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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
    }
  }, [targetUser]);

  // useEffect(() => {
  //   console.log(posts);
  // }, [posts]);

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
    <div className={`profile ${theme === 'light' ? 'light' : ''}`}>
      <div className="profile-user-info">
        <img src={targetUser?.photoURL || marmot} alt="user avatar" />
        <h3>{targetUser?.displayName}</h3>
        {currentUser?.uid === targetUser?.uid && (
          <button onClick={initializeEditProfile}>Edit & Setting</button>
        )}
      </div>

      {showEditProfile && currentUser?.uid === targetUser?.uid && (
        <Dialogue>
          <div className="profile-edit">
            <h3>Edit & Setting</h3>
            <div className="form">
              <fieldset className="fieldset-1">
                <legend>Edit Profile</legend>
                <div className="edit-avatar">
                  <label htmlFor="avatar">
                    <span>Edit</span>
                    <img src={editProfile.avatar|| marmot} alt="" />
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

                <div className="edit-btns">
                  <button onClick={handleEditProfile}>Save Profile</button>
                  <button onClick={() => setShowEditProfile(false)}>
                    Cancel
                  </button>
                </div>
              </fieldset>

              {//will add this feature later
              /* <fieldset className="fieldset-2">
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

                <div className="edit-btns">
                  <button onClick={handleChangePassword}>
                    Change Password
                  </button>
                  <button onClick={() => setShowEditProfile(false)}>
                    Cancel
                  </button>
                </div>
              </fieldset> */}
            </div>
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
          {currentUser?.uid === targetUser?.uid && (
            <button
              className={`${active === "draft" ? "active" : ""}`}
              onClick={handleDraftsBtn}
            >
              Drafts
            </button>
          )}
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
