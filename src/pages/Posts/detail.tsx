import PostBox from "components/PostBox";
import AuthContext from "context/AuthContext";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PostDetailPage() {
  const { user } = useContext(AuthContext);
  const params = useParams();

  const [post, setPost] = useState<PostProps>();

  const getPost = () => {
    if (params?.id) {
      try {
        const ref = doc(db, "posts", params?.id);
        onSnapshot(ref, (doc) => {
          setPost({ ...doc.data(), id: doc.id } as PostProps);
        });
      } catch (error) {
        console.error("Error getting document: ", error);
      }
    }
  };

  useEffect(()=>{
    getPost();
  },[params?.id]);
  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Post</div>
      </div>
      {post?.id &&
      <PostBox post={post as PostProps} isDetail/>
      }
    </div>
  );
}
