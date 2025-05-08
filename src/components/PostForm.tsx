import AuthContext from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";

export default function PostForm() {
  const handleFileUpload = () => {};

  const { user } = useContext(AuthContext);

  const [content, setContent] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = e;
    setContent(value);
  };

  const [hashtag, setHashtag] = useState<string>("");
  const onChangeHashtag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setHashtag(value);
  };

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() !== "") {
      const newTag = e.target.value.trim();
      if (tags.includes(newTag)) {
        toast.error("이미 존재하는 태그입니다.");
        return;
      }
      setTags((prev) => [...prev, newTag]);
      setHashtag("");
    }
  };
  
  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  const [tags, setTags] = useState<string[]>([]);

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
        hashTags: tags
      });

      setContent("");
      setTags([]);
      setHashtag("");
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
      <div className="post-form__hashtags">
       <div className="post-form__hashtags-output">
         {tags.map((tag, index) => (
           <span key={index} className="post-form__hashtags-tag" onClick={()=>removeTag(tag)}>
             #{tag}
           </span>
         ))}
       </div>
        <input
          type="text"
          className="post-form__input"
          id="hashtag"
          name="hashtag"
          placeholder="스페이스바로 태그 입력"
          onKeyUp={handleKeyUp}
          onChange={onChangeHashtag}
          value={hashtag}
        />
      </div>
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
        <input
          type="submit"
          value="upload"
          className="button post-form__submit-btn"
        />
      </div>
    </form>
  );
}
