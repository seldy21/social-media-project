import { IoIosHome, IoMdSearch } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { app } from "firebaseApp";
import { FaRegBell } from "react-icons/fa6";

export default function MenuList() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const onSignOut = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      toast.success("로그아웃 되었습니다. 또 와요! 👻");
    } catch (error) {
      console.error(error);
      toast.error("로그아웃에 실패했습니다.");
    }
  };

  return (
    <div className="footer">
      <div className="footer__grid">
        <button type="button" onClick={() => navigate("/")}>
          <IoIosHome />
          HOME
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          <CgProfile />
          PROFILE
        </button>
        <button type="button" onClick={() => navigate("/search")}>
          <IoMdSearch />
          SEARCH
        </button>
        <button type="button" onClick={() => navigate("/notification")}>
          <FaRegBell />
          NOTIFICATIONS
        </button>
        {user === null ? (
          <button type="button" onClick={() => navigate("/")}>
            <FiLogIn />
            LOGIN
          </button>
        ) : (
          <button type="button" onClick={() => onSignOut()}>
            <FiLogOut />
            LOGOUT
          </button>
        )}
      </div>
    </div>
  );
}
