import AuthContext from "context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FollowingProps {
  post: PostProps;
}

export interface UserProps {
  id: string;
}

export default function FollowingBox({ post }: FollowingProps) {
  const { user } = useContext(AuthContext);
  const [postFollowers, setPostFollowers] = useState<any[]>([]);
  const handleFollow = async () => {
    try {
      if (!user) return;
      //내가 팔로우 생성 or 업데이트
      const followRef = doc(db, "following", user?.uid);
      await setDoc(
        followRef,
        {
          users: arrayUnion({ id: post?.uid }),
        },
        { merge: true }
      );

      //팔로우 받은 사람의 입장에서 생성 or 업데이트
      const followerRef = doc(db, "followers", post?.uid);
      await setDoc(
        followerRef,
        {
          users: arrayUnion({ id: user?.uid }),
        },
        { merge: true }

      );
      toast.success("팔로우 하였습니다! 😎");
    } catch (error) {}
  };

  const getFollowers = useCallback(async () => {
    if (post.uid) {
      const ref = doc(db, "followers", post.uid);
      onSnapshot(ref, (doc) => {
        setPostFollowers([]);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setPostFollowers((prev: UserProps[]) =>
              prev ? [...prev, user?.id] : []
            )
          );
      });
    }
  }, [post.uid]);

  useEffect(() => {
    post?.uid && getFollowers();
  }, [getFollowers, post?.uid]);

  const handleCancelFollow = async () => {
    try {
      if (!user) return;
      //내가 팔로우 삭제
      const followRef = doc(db, "following", user?.uid);
      await updateDoc(followRef, {
        users: arrayRemove({ id: post?.uid }),
      });

      //팔로우 받은 사람의 입장에서 삭제
      const followerRef = doc(db, "followers", post?.uid);
      await updateDoc(followerRef, {
        users: arrayRemove({ id: user.uid }),
      });

      toast.success("팔로우를 취소하였습니다! 😋");
    } catch (error) {
      console.error("Error removing follow: ", error);
    }
  };

  return postFollowers.includes(user?.uid) ? (
    <button className="post__following-btn" onClick={handleCancelFollow}>
      following
    </button>
  ) : (
    <button className="post__follow-btn" onClick={handleFollow}>
      follow
    </button>
  );
}
