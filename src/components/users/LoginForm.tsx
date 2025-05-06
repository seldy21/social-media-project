import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { app } from "firebaseApp";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const submitValidator = () => {
    const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.match(validateEmail)) {
      setError("이메일 형식이 올바르지 않습니다.");
    } else if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
    } else {
      setError("");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitValidator();
    if (error.length > 0) return;

    console.log("Signup successful with email:", email);
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          // ...
          navigate("/");
          toast.success("로그인되었습니다. 😎🦄");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
        });
    } catch (error) {
      console.error("Error during signup:", error);
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  //OAuth
  const handleSocialLogin = async (e: any) => {
    const {
      target: { name },
    } = e;

    let provider;
    const auth = getAuth(app);

    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(
      auth,
      provider as GoogleAuthProvider | GithubAuthProvider
    )
      .then((userCredential) => {
        // const user = userCredential.user;
        navigate("/");
        toast.success("로그인되었습니다. 🥰🐯");
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  return (
    <form className="form form--lg" onSubmit={handleLogin}>
      <div className="form__title">로그인</div>
      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input
          type="text"
          name="email"
          id="email"
          required
          value={email}
          onChange={handleValue}
        />
      </div>
      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          value={password}
          onChange={handleValue}
        />
      </div>
      {error && error.length > 0 && (
        <div className="form__block">
          <div className="form__error">{error}</div>
        </div>
      )}
      <div className="form__block">
        계정이 없으신가요?{" "}
        <Link to="/signup" className="form__link">
          회원가입 하러가기
        </Link>
      </div>
      <div className="form__block">
        <button type={"submit"} className="form__submit-btn">
          로그인
        </button>
      </div>
      <div className="form__block">
        <button
          type={"button"}
          className="form__submit-btn form__submit-btn__google"
          onClick={handleSocialLogin}
          name="google"
        >
          구글 로그인
        </button>
      </div>
      <div className="form__block">
        <button
          type={"button"}
          className="form__submit-btn form__submit-btn__github"
          name={"github"}
          onClick={handleSocialLogin}
        >
          github 로그인
        </button>
      </div>
    </form>
  );
}
