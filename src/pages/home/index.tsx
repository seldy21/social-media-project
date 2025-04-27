
import PostBox from "components/PostBox";
import PostForm from "components/PostForm";

export interface PostProps {
  id: number;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
}

const posts: PostProps[] = [
  {
    id: 1,
    email: "email@mail.com",
    content: "Hello World",
    createdAt: "2023-10-01T12:00:00Z",
    uid: "123123123",
  },
  {
    id: 2,
    email: "email@mail.com",
    content: "Hello World",
    createdAt: "2023-10-01T12:00:00Z",
    uid: "123123123",
  },
  {
    id: 3,
    email: "email@mail.com",
    content: "Hello World",
    createdAt: "2023-10-01T12:00:00Z",
    uid: "123123123",
  },
  {
    id: 4,
    email: "email@mail.com",
    content: "Hello World",
    createdAt: "2023-10-01T12:00:00Z",
    uid: "123123123",
  },
];

export default function HomePage() {
  return (
    <div className="home">
      <div className="home__title">Home</div>
      <div className="home__tabs">
        <div className="home__tab home__tab-active">For You</div>
        <div className="home__tab">Following</div>
      </div>
      <PostForm/>
      <div className="post">
        {posts.map((post) => (
          <PostBox key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
