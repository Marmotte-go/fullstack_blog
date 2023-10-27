import React, {useContext, useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

import './Home.scss';
import Featured from '../components/Featured';
import PostCard from '../components/PostCard';

import { db } from '../firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';


const Home = () => {
  const {theme} = useContext(ThemeContext);
  // const [testPosts, setTestPosts] = useState([]);

  const [posts, setPosts] = useState([]);

  const cat = useLocation().search;
  const catValue = new URLSearchParams(cat).get("cat");

  // useEffect(() => {
  //   if(catValue === null) {
  //     setTestPosts(posts);
  //     return;
  //   }
  //   const getPosts = () => {
  //     setTestPosts(posts.filter((post) => post.category === catValue));
  //   }
  //   getPosts();
  // }, [catValue]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          catValue ? where("category", "==", catValue) : null,
          where("status", "==", "publish"),
          orderBy("createdAt", "desc")
        );
        const docSnap = await getDocs(q);
        const posts = docSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(posts);
      } catch (err) {
        console.log(err);
      }
    };
    getPosts();
  }, [catValue]);

  return (
    <div className={`home ${theme === 'light' ? 'light' : ''}`}>
      <Featured />
      <div className="home-container">
        <div className="home-posts">
          {posts.map((post) => (
            <PostCard post={post} key={post.id}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home