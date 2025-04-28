import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "firebaseApp";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignupForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

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
      case "passwordConfirm":
        setPasswordConfirm(value);
        break;
      default:
        break;
    }
  };

  const submitValidator = () => {
    const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length === 0) {
      setError("이메일을 입력해주세요.");
    } else if (!email?.match(validateEmail)) {
      setError("이메일 형식이 올바르지 않습니다.");
    } else if (password.length === 0) {
      setError("비밀번호를 입력해주세요.");
    } else if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
    } else if (passwordConfirm.length > 0 && password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
    } else {
      setError("");
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitValidator();
    if (error.length > 0) return;

    console.log("Signup successful with email:", email);
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          // ...
          navigate("/");
          toast.success("회원가입이 완료되었습니다. 🥰🐯");
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

  return (
    <form className="form form--lg" onSubmit={handleSignup}>
      <div className="form__title">회원가입</div>
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
      <div className="form__block">
        <label htmlFor="passwordConfirm">비밀번호 확인</label>
        <input
          type="password"
          name="passwordConfirm"
          id="passwordConfirm"
          required
          value={passwordConfirm}
          onChange={handleValue}
        />
      </div>
      {error && error.length > 0 && (
        <div className="form__block">
          <div className="form__error">{error}</div>
        </div>
      )}
      <div className="form__block">
        계정이 있으신가요? <Link to="/login" className="form__link">로그인 하러가기</Link>
      </div>
      <div className="form__block">
        <button type="submit" className="form__submit-btn">
          회원가입
        </button>
      </div>
    </form>
  );
}
