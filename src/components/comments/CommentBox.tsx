import AuthContext from "context/AuthContext";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { toast } from "react-toastify";
import styles from "./Comment.module.scss";

export interface CommentProps {
  comment: string;
  uid: string;
  email: string;
  createdAt: string;
}

interface CommentBoxProps {
  data: CommentProps;
  post: PostProps;
}

export default function CommentBox({ data, post }: CommentBoxProps) {
  const { user } = useContext(AuthContext);
  const handleDeleteComment = async () => {
    if (post) {
      try {
        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, {
          comments: arrayRemove(data),
        });
        toast.success("댓글을 삭제하였습니다👍!");
      } catch (error) {
        console.log(error);
        toast.error("댓글 삭제에 실패하였습니다😢!");
      }
    }
  };

  return <div key={data?.createdAt} className={styles.comment}>
    <div className={styles.commemt__borderBox}>
      <div className={styles.comment__imgBox}>
        <div className={styles.comment__flexBox}>
          <img src="https://i.pinimg.com/736x/b9/73/74/b97374bfdcf71dd819ad2d53293da861.jpg" alt="profile" />
          <div className={styles.comment__email}>{data?.email}</div>
          <div className={styles.comment__createdAt}>{data?.createdAt}</div>
        </div>
      </div>
      <div className={styles.comment__content}>{data?.comment}</div>
    </div>
    <div className={styles.comment__submitDiv}>
      {data?.uid === user?.uid && (
        <button
          type="button"
          onClick={handleDeleteComment}
        >
          삭제
        </button>
      )}
    </div>
  </div>;
}
