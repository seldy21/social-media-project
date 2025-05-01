import AuthContext from "context/AuthContext";
import {
  doc,
  updateDoc,
  deleteDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useRef, useState } from "react";
import { FaCircleUser, FaRegCommentDots } from "react-icons/fa6";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PostBoxProps {
  post: PostProps;
}

export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleDelete = async () => {
    const confirm = window.confirm("정말로 삭제하시겠습니까?");

    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "posts", post.id));
      toast.success("게시글을 삭제하였습니다👍!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("게시글 삭제에 실패하였습니다😢!");
    }
  };

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

  //수정 시 태그 삭제
  const [tags, setTags] = useState<string[]>(post?.hashTags ?? []);
  const deleteTag = (tag: any) => {
    setTags((prev) => prev.filter((t) => t !== tag));
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

  const handleCancel = () => {
    setEditContent(post.content);
    setTags(post?.hashTags ?? []);
    setEditStatus(false);
  };

  const handleSave = async () => {
    try {
      const postRef = doc(db, "posts", post.id);

      await updateDoc(postRef, {
        content: editContent,
        hashTags: tags,
      });
      setEditStatus(false);
      toast.success("게시글을 수정하였습니다👍!");
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("게시글 수정에 실패하였습니다😢!");
    }
  };

  //코멘트창 열기
  const commentAreaRef = useRef<HTMLDivElement>(null);
  const showCommentArea = () => {
    commentAreaRef.current?.classList.toggle("show");
  };

  //해시태그 검색
  const searchTag = (tag: string) => {
    navigate("/search", {
      state: { tagQuery: tag },
    });
  };

  //좋아요 기능
  const toggleLike = async () => {
    const postRef = doc(db, "posts", post.id);

    // 좋아요를 누른 유저의 uid가 포함되어 있는지 확인해서 좋아요를 취소하거나 추가
    if (user?.uid && post?.likes?.includes(user?.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
      });
      toast.success("좋아요를 취소하였습니다😯!");
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
      });
      toast.success("해당 게시물에 좋아요를 눌렀습니다😉!");
    }
  };
  return (
    <div className="post__box" key={post.id}>
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

        <div className="post-form__hashtags-output">
          {editStatus ? (
            <>
              {tags.map((tag, index) => (
                <span
                  key={`hash_${post.createdAt}_${index}`}
                  className="post-form__hashtags-tag"
                  onClick={() => deleteTag(tag)}
                >
                  #{tag}
                </span>
              ))}
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
            </>
          ) : (
            post?.hashTags?.map((tag, index) => (
              <span
                key={`hash_${post.createdAt}_${index}`}
                className="post-form__hashtags-tag"
                onClick={() => searchTag(tag)}
              >
                #{tag}
              </span>
            ))
          )}
        </div>
      </div>
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
          <button type="button" className="post__like" onClick={toggleLike}>
            {user?.uid && post?.likes?.includes(user?.uid) ? (
              <IoIosHeart />
            ) : (
              <IoIosHeartEmpty />
            )}
            {post?.likeCount ?? 0}
          </button>
          <button
            type="button"
            className="post__comments"
            onClick={showCommentArea}
          >
            <FaRegCommentDots /> {post?.comments?.length ?? 0}
          </button>
        </>
      </div>
      <div ref={commentAreaRef} className="post__comment-area"></div>
    </div>
  );
}
