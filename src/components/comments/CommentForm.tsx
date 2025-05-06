import AuthContext from "context/AuthContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

export interface CommentFormProps {
  post: PostProps;
}

export default function CommentForm({ post }: CommentFormProps) {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const postRef = doc(db, "posts", post.id);
      const coomentObj = {
        comment: comment,
        uid: user?.uid,
        email: user?.email,
        createdAt: new Date().toLocaleDateString("ko", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      await updateDoc(postRef, {
        comments: arrayUnion(coomentObj),
      });
      toast.success("댓글을 생성하였습니다👍!");
      setComment("");
    } catch (error) {      
      toast.error("댓글을 생성하는 데 오류가 발생했어요😫");
    }
  };

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea post-form__textarea-comment"
        name="comment"
        id="comment"
        required
        placeholder="Comment...."
        onChange={onChange}
        value={comment}
      ></textarea>
      <div className="post-form__submit-area">
        <div />
        <input
          type="submit"
          value="Comment"
          className="post-form__submit-btn"
          disabled={!comment}
        />
      </div>
    </form>
  );
}
