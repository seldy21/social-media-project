import AuthContext from "context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useState } from "react";
import { FaCircleUser, FaRegCommentDots } from "react-icons/fa6";
import { IoIosHeartEmpty } from "react-icons/io";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface PostBoxProps {
  post: PostProps;
}

export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const handleDelete = () => {};

  const [editStatus, setEditStatus] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>(post.content);

  const handleEdit = () => {
    setEditStatus(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = e;
    setEditContent(value);
  };

  const handleCancel = () => {
    setEditStatus(false);
  };

  const handleSave = async () => {
    try {
      const postRef = doc(db, "posts", post.id);

      await updateDoc(postRef, {
        content: editContent,
      });
      setEditStatus(false);
      toast.success("게시글을 수정하였습니다👍!");

    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("게시글 수정에 실패하였습니다😢!");
    }
   
  };
  return (
    <div className="post__box" key={post.id}>
      {/* <Link to={`/posts/${post.id}`} className="post__link"> */}
      <div className="post__box-profile">
        <div className="post__flex">
          {post?.profileUrl ? (
            <img src={post?.profileUrl} alt="profile" />
          ) : (
            <FaCircleUser className="post__box-profile-icon" />
          )}
          <div className="post__email">{post?.email}</div>
          <div className="post__createdAt">{post?.createdAt}</div>
        </div>
        <div className="post__box-content">
          {editStatus ? (
            <textarea value={editContent} onChange={onChange}></textarea>
          ) : (
            post?.content
          )}
        </div>
      </div>
      {/* </Link> */}
      <div className="post__box-footer">
        {editStatus && (
          <>
            <button type="button" className="post__save" onClick={handleSave}>
              save
            </button>
            <button
              type="button"
              className="post__cancel"
              onClick={handleCancel}
            >
              cancel
            </button>
          </>
        )}
        {user?.uid === post.uid && !editStatus && (
          <>
            <button
              type="button"
              className="post__delete"
              onClick={handleDelete}
            >
              delete
            </button>
            <button type="button" className="post__edit" onClick={handleEdit}>
              edit
            </button>
          </>
        )}
        <>
          <button type="button" className="post__like">
            <IoIosHeartEmpty />
            {post?.likeCount ?? 0}
          </button>
          <button type="button" className="post__comments">
            <FaRegCommentDots /> {post?.comments?.length ?? 0}
          </button>
        </>
      </div>
    </div>
  );
}
