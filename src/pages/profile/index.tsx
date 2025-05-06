import { languageState } from "atom";
import PostBox from "components/PostBox";
import AuthContext from "context/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [language, setLanguage] = useRecoilState(languageState);
  const [tab, setTab] = useState<string>("my");
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [likesPosts, setLikesPosts] = useState<PostProps[]>([]);

  const getPosts = useCallback(() => {
    if (user) {
      let postsRef = collection(db, "posts");

      const postsQuery = query(
        postsRef,
        tab === "my"
          ? where("uid", "==", user?.uid)
          : where("likes", "array-contains", user?.uid),
        orderBy("createdAt", "desc")
      );
      onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        tab === "my"
          ? setMyPosts(postsData as PostProps[])
          : setLikesPosts(postsData as PostProps[]);
      });
    }
  }, [user, tab]);

  useEffect(() => {
    if (user) {
      getPosts();
    }
  }, [user, tab, getPosts]);

  //language 변경
  const onClickLanguage = () => {
    setLanguage(language === "ko" ? "en" : "ko");
    localStorage.setItem("myProjectLanguage", language === "ko" ? "en" : "ko");
  };
  return (
    <div className="home">
      <div className="home__title">Profile</div>
      <div className="profile">
        <div className="profile__wrapper-flex">
          <div className="profile__image"></div>
          <div className="profile__flex">
            <button className="profile__btn">프로필 수정</button>
            <button className="profile__btn profile__btn__language" onClick={onClickLanguage}>
              {language === "ko" ? "한국어" : "ENGLISH"}
            </button>
          </div>
        </div>
        <div className="profile__name">{user?.displayName}</div>
        <div className="profile__email">{user?.email}</div>
      </div>
      <div className="home__top">
        <div className="home__tabs">
          <div
            className={`home__tab ${tab === "my" ? "home__tab-active" : ""}`}
            onClick={() => {
              setTab("my");
            }}
          >
            MY POST
          </div>
          <div
            className={`home__tab ${tab === "likes" ? "home__tab-active" : ""}`}
            onClick={() => setTab("likes")}
          >
            LIKES
          </div>
        </div>
      </div>
      <div className="post">
        {tab === "my" &&
          (myPosts.length > 0 ? (
            myPosts.map((post) => <PostBox key={post.id} post={post} />)
          ) : (
            <div className="post__no-post">게시글이 없습니다. </div>
          ))}
        {tab === "likes" &&
          (likesPosts.length > 0 ? (
            likesPosts.map((post) => <PostBox key={post.id} post={post} />)
          ) : (
            <div className="post__no-post">좋아요한 게시글이 없습니다. </div>
          ))}
      </div>
    </div>
  );
}
