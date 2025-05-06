import { UserProps } from "components/following/FollowingBox";
import PostBox from "components/PostBox";
import PostForm from "components/PostForm";
import AuthContext from "context/AuthContext";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { useCallback, useContext, useEffect, useState } from "react";

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

type tabType = "all" | "following";

export default function HomePage() {
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState<PostProps[]>([]);

  const [followingIds, setFollowingIds] = useState<string[]>([""]);

  const [followingPosts, setFollowingPosts] = useState<PostProps[]>([]);

  const [tab, setTab] = useState<tabType>("all");

  //실시간 동기화로 user 의 팔로잉 아이디 가져오기
  const getFollowingIds = useCallback(async () => {
    if (user?.uid) {
      const ref = doc(db, "following", user.uid);
      onSnapshot(ref, (doc) => {
        setFollowingIds([""]);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setFollowingIds((prev : string[]) => (prev ? [...prev, user.id] : []))
          );
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      const postsQuery = query(postsRef, orderBy("createdAt", "desc"));

      onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(postsData as PostProps[]);
      });

      
      const followingQuery = query(postsRef, where('uid', 'in', followingIds), orderBy("createdAt", "desc"));
      onSnapshot(followingQuery, (snapshot) => {
        const followingPostsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setFollowingPosts(followingPostsData as PostProps[]);
      });
    }
  }, [followingIds, user]);

  useEffect(()=>{
    if (user?.uid) {
      getFollowingIds();
    }
  },[user?.uid, getFollowingIds])

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Home</div>
        <div className="home__tabs">
          <div
            className={`home__tab ${tab === "all" ? "home__tab-active" : ""}`}
            onClick={() => setTab("all")}
          >
            All
          </div>
          <div
            className={`home__tab ${
              tab === "following" ? "home__tab-active" : ""
            }`}
            onClick={() => setTab("following")}
          >
            Following
          </div>
        </div>
      </div>
      <PostForm />
      <div className="post">
      {tab === "all" ? (
          posts.length > 0 ? (
            posts.map((post) => <PostBox key={post.id} post={post} />)
          ) : (
            <div className="post__no-post">게시글이 없습니다. </div>
          )
      ) : (
        followingPosts.length > 0 ? (
          followingPosts.map((post) => <PostBox key={post.id} post={post} />)
        ) : (
          <div className="post__no-post">게시글이 없습니다. </div>
        )
      )}
        </div>
    </div>
  );
}
