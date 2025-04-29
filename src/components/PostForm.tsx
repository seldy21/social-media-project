import AuthContext from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";

export default function PostForm() {
  const handleFileUpload = () => {};

  const {user} = useContext(AuthContext);

  const [content, setContent] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = e;
    setContent(value);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "posts"), {
        content,
        createdAt: new Date().toLocaleDateString("ko", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
      });

      setContent("");
      toast.success("게시글을 생성하였습니다😍!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        name="content"
        className="post-form__textarea"
        required
        placeholder="What is happened?"
        onChange={onChange}
        value={content}
      ></textarea>
      <div className="post-form__submit-area">
        <label htmlFor="file-input" className="post-form__file">
          <FiImage className="post-form__file-icon" />
        </label>
        <input
          type="file"
          name="file-input"
          id="file-input"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <input type="submit" value="tweet" className="button post-form__submit-btn" />
      </div>
    </form>
  );
}
