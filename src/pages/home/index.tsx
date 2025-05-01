import PostBox from "components/PostBox";
import PostForm from "components/PostForm";
import AuthContext from "context/AuthContext";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useEffect, useState } from "react";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
  hashTags?: string[];
}

export default function HomePage() {
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState<PostProps[]>([]);
  
  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      const postsQuery = query(postsRef, orderBy("createdAt", "desc"));
      onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(postsData)
        setPosts(postsData as PostProps[]);
      });
    }
  }, [user]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Home</div>
        <div className="home__tabs">
          <div className="home__tab home__tab-active">For You</div>
          <div className="home__tab">Following</div>
        </div>
      </div>
      <PostForm />
      <div className="post">
        {posts.length > 0 ? (
          posts.map((post) => <PostBox key={post.id} post={post} />)
        ) : (
          <div className="post__no-post">게시글이 없습니다. </div>
        )}
      </div>
    </div>
  );
}
