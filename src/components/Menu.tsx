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
import useTranslation from "hooks/useTranslation";

export default function MenuList() {
  const navigate = useNavigate();
  const t = useTranslation();

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
          <span className="footer__grid-text">{t("MENU_HOME")}</span>
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          <CgProfile />
          <span className="footer__grid-text"> {t("MENU_PROFILE")}</span>
        </button>
        <button type="button" onClick={() => navigate("/search")}>
          <IoMdSearch />
          <span className="footer__grid-text">{t("MENY_SEARCH")}</span>
        </button>
        <button type="button" onClick={() => navigate("/notification")}>
          <FaRegBell />
          <span className="footer__grid-text">{t("MENU_NOTI")}</span>
        </button>
        {user === null ? (
          <button type="button" onClick={() => navigate("/")}>
            <FiLogIn />
            <span className="footer__grid-text">{t("MENU_LOGIN")}</span>
          </button>
        ) : (
          <button type="button" onClick={() => onSignOut()}>
            <FiLogOut />
            <span className="footer__grid-text">{t("MENU_LOGOUT")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
