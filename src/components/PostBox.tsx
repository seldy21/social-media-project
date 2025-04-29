import AuthContext from "context/AuthContext";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { FaCircleUser, FaRegCommentDots } from "react-icons/fa6";
import {  IoIosHeartEmpty } from "react-icons/io";
import { Link } from "react-router-dom";

interface PostBoxProps {
  post: PostProps;
}

export default function PostBox({ post }: PostBoxProps) {

  const {user } = useContext(AuthContext);
  const handleDelete = () => {};
  return (
    <div className="post__box" key={post.id}>
      <Link to={`/posts/${post.id}`} className="post__link">
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
          <div className="post__box-content">{post?.content}</div>
        </div>
      </Link>
      <div className="post__box-footer">
       {user?.uid === post.uid && <>
          <button type="button" className="post__delete" onClick={handleDelete}>
            delete
          </button>
          <button type="button" className="post__edit">
            <Link to={`/posts/edit/${post?.id}`}>edit</Link>
          </button>
        </>}
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
