import PostBox from "components/PostBox";
import AuthContext from "context/AuthContext";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SearchPage() {
  const location = useLocation();
  const user = useContext(AuthContext);
  const [posts, setPosts] = useState<PostProps[]>([]);

  const [tagQuery, setTagQuery] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagQuery(e.target.value?.trim());
  };

  useEffect(()=>{
    if (user) {
      const postRef = collection(db, "posts");
      const postsQuery = query(postRef, where("hashTags","array-contains-any", [tagQuery]), orderBy("createdAt", "desc"));

      onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(postsData);

        setPosts(postsData as PostProps[]);
      });
    }
  },[user, tagQuery]);

  useEffect(() => {
    console.log(location?.state?.tagQuery);
    location?.state?.tagQuery && setTagQuery(location?.state?.tagQuery ?? "");
  }, [location.search]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">
          <div className="home_title-text">Search</div>
        </div>
        <div className="home__search-div">
          <input
            type="text"
            className="home__search"
            placeholder="해시태그 검색"
            onChange={onChange}
            value={tagQuery}
          />
        </div>
      </div>
      <div className="posts">
        <div className="post">
          {posts.length > 0 ? (
            posts.map((post) => <PostBox key={post.id} post={post} />)
          ) : (
            <div className="post__no-post">게시글이 없습니다. </div>
          )}
        </div>
      </div>
    </div>
  );
}
