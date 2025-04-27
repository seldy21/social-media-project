import { FiImage } from "react-icons/fi";

export default function PostForm() {
  const handleFileUpload = () => {};
  return (
    <form action="" className="post-form">
      <textarea
        name="content"
        className="post-form__textarea"
        required
        placeholder="What is happened?"
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
        <input type="button" value="tweet" className="post-form__submit-btn" />
      </div>
    </form>
  );
}
