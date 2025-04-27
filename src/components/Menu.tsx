import { IoIosHome } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

export default function MenuList() {
  const navigate = useNavigate();

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
        <button type="button" onClick={() => navigate("/")}>
          <FiLogOut /> 
          LOGOUT
        </button>
      </div>
    </div>
  );
}
